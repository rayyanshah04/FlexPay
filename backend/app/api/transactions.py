from flask import Blueprint, request, jsonify
from ..database import db
from ..utils import session_token_required
from ..logger import log_event
from firebase_admin import messaging
import secrets
from datetime import datetime
import pytz

bp = Blueprint('transactions', __name__, url_prefix='/api')

@bp.route('/transactions/send', methods=['POST'])
@session_token_required
def send_money(current_user):
    data = request.get_json()
    receiver_phone = data.get('receiver_phone')
    amount = data.get('amount')
    note = data.get('note', '')
    sender_id = current_user['id']
    
    print(f"DEBUG: ============ TRANSACTION REQUEST ============")
    print(f"DEBUG: Sender ID: {sender_id}")
    print(f"DEBUG: Sender Name: {current_user.get('name', 'Unknown')}")
    print(f"DEBUG: Receiver Phone: '{receiver_phone}'")
    print(f"DEBUG: Amount: {amount}")
    print(f"DEBUG: =============================================")

    if not receiver_phone or not amount:
        return jsonify({"error": "Receiver phone number and amount are required"}), 400

    try:
        amount = float(amount)
        if amount <= 0:
            return jsonify({"error": "Amount must be positive"}), 400
    except ValueError:
        return jsonify({"error": "Invalid amount"}), 400

    # Get receiver with name and device_token
    receiver = db.execute("SELECT id, name, phone_number, device_token FROM users WHERE phone_number = ?", receiver_phone)
    print(f"DEBUG: Receiver query result: {receiver}")
    if not receiver:
        log_event('WARNING', f'Receiver not found with phone: {receiver_phone}', user_id=sender_id)
        print(f"DEBUG: Receiver not found. Phone searched: '{receiver_phone}'")
        return jsonify({"error": "Receiver not found"}), 404
    receiver_id = receiver[0]['id']
    receiver_name = receiver[0]['name']
    receiver_device_token = receiver[0]['device_token']
    print(f"DEBUG: Receiver found - ID: {receiver_id}, Name: {receiver_name}, Device Token: {receiver_device_token}")

    if sender_id == receiver_id:
        print(f"DEBUG: Cannot send to self! sender_id={sender_id}, receiver_id={receiver_id}")
        return jsonify({"error": "You cannot send money to yourself"}), 400

    # Check sender's balance and get sender name
    sender = db.execute("SELECT balance, name FROM users WHERE id = ?", sender_id)
    if not sender:
        return jsonify({"error": "Sender not found"}), 404
    
    sender_balance = sender[0]['balance']
    sender_name = sender[0]['name']
    
    if sender_balance < amount:
        log_event('WARNING', f'Insufficient balance for user_id: {sender_id} to send {amount}', user_id=sender_id)
        return jsonify({"error": "Insufficient balance"}), 400

    try:
        # Generate unique 7-digit hexadecimal transaction ID
        def generate_transaction_id():
            """Generate a unique 7-character hexadecimal transaction ID"""
            while True:
                txn_id = secrets.token_hex(4)[:7].upper()  # Generate 7-char hex
                # Check if this ID already exists
                existing = db.execute("SELECT id FROM transactions WHERE transaction_id = ?", txn_id)
                if not existing:
                    return txn_id
        
        transaction_id = generate_transaction_id()
        
        # Get current time in GMT+5 (Pakistan timezone)
        pk_timezone = pytz.timezone('Asia/Karachi')
        current_time = datetime.now(pk_timezone).strftime('%Y-%m-%d %H:%M:%S')
        
        # Perform atomic transaction
        db.execute("UPDATE users SET balance = balance - ? WHERE id = ?", amount, sender_id)
        db.execute("UPDATE users SET balance = balance + ? WHERE id = ?", amount, receiver_id)
        
        # Insert TWO transaction records - one for sender, one for receiver
        # Both records get the SAME transaction_id
        # Record 1: Sender's perspective (money sent)
        db.execute(
            "INSERT INTO transactions (transaction_id, transaction_type, sender_id, receiver_id, amount, status, note, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            transaction_id, 'sent', sender_id, receiver_id, amount, 'completed', note, current_time
        )
        sender_record_id = db.execute("SELECT last_insert_rowid() as id")[0]['id']
        
        # Record 2: Receiver's perspective (money received)
        db.execute(
            "INSERT INTO transactions (transaction_id, transaction_type, sender_id, receiver_id, amount, status, note, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            transaction_id, 'received', sender_id, receiver_id, amount, 'completed', note, current_time
        )
        receiver_record_id = db.execute("SELECT last_insert_rowid() as id")[0]['id']
        
        log_event('INFO', f'Transaction {transaction_id} from {sender_id} to {receiver_id} for {amount}', 
                 user_id=sender_id, details=f"receiver_id: {receiver_id}, amount: {amount}, txn_id: {transaction_id}")
        
        # Send push notification to receiver
        if receiver_device_token:
            try:
                message = messaging.Message(
                    notification=messaging.Notification(
                        title="💰 Money Received!",
                        body=f"You received Rs. {amount} from {sender_name}",
                    ),
                    data={
                        "type": "transaction",
                        "amount": str(amount),
                        "sender": sender_name
                    },
                    token=receiver_device_token,
                )
                response = messaging.send(message)
                print(f"DEBUG: FCM Notification Result: {response}")
                log_event('INFO', f'Push notification sent to {receiver_id}', user_id=receiver_id, details=f"amount: {amount}, sender: {sender_name}")
            except Exception as e:
                log_event('ERROR', f'Failed to send push notification to {receiver_id}. Error: {e}', user_id=receiver_id)
                print(f"ERROR: Failed to send push notification: {e}")
        else:
            print(f"DEBUG: No device token for receiver {receiver_id}. Notification not sent.")
            log_event('WARNING', f'No device token for receiver {receiver_id}. Notification not sent.', user_id=receiver_id)
        
        return jsonify({
            "message": "Transaction successful",
            "transaction_id": transaction_id,
            "amount": amount,
            "receiver_name": receiver_name,
            "sender_name": sender_name,
            "new_balance": sender_balance - amount
        })
    except Exception as e:
        # Log error and return failure
        log_event('ERROR', f'Transaction failed for user_id: {sender_id}. Error: {e}', user_id=sender_id)
        return jsonify({"error": f"Transaction failed: {str(e)}"}), 500


@bp.route('/transactions', methods=['GET'])
@session_token_required
def get_transactions(current_user):
    user_id = current_user['id']
    
    transactions = db.execute(
        "SELECT t.id, t.transaction_type, t.amount, t.timestamp, t.status, "
        "t.sender_id, t.receiver_id, t.note, "
        "CASE "
        "  WHEN t.transaction_type = 'transfer' THEN s.name "
        "  WHEN t.transaction_type = 'sent' THEN r.name "
        "  WHEN t.transaction_type = 'received' THEN s.name "
        "  WHEN t.transaction_type = 'redeemed' THEN 'Coupon: ' || t.note "
        "  ELSE 'System' "
        "END as sender_name, "
        "r.name as receiver_name "
        "FROM transactions t "
        "LEFT JOIN users s ON t.sender_id = s.id "
        "LEFT JOIN users r ON t.receiver_id = r.id "
        "WHERE "
        "  (t.sender_id = ? AND t.transaction_type IN ('sent', 'transfer')) "
        "  OR (t.receiver_id = ? AND t.transaction_type IN ('received', 'transfer', 'redeemed')) "
        "ORDER BY t.timestamp DESC",
        user_id, user_id
    )

    return jsonify({"transactions": transactions})


@bp.route('/coupons/redeem', methods=['POST'])
@session_token_required
def redeem_coupon(current_user):
    """Redeem a coupon code and credit the amount to user's balance"""
    data = request.get_json()
    coupon_code = data.get('coupon_code', '').upper().strip()
    user_id = current_user['id']
    
    print(f"DEBUG: ============ COUPON REDEMPTION ============")
    print(f"DEBUG: User ID: {user_id}")
    print(f"DEBUG: User Name: {current_user.get('name', 'Unknown')}")
    print(f"DEBUG: Coupon Code: '{coupon_code}'")
    print(f"DEBUG: ==========================================")
    
    if not coupon_code:
        return jsonify({"error": "Coupon code is required"}), 400
    
    try:
        # Check if coupon exists
        coupon = db.execute("SELECT id, coupon_code, amount FROM coupons WHERE coupon_code = ?", coupon_code)
        
        if not coupon:
            log_event('WARNING', f'Invalid coupon code attempted: {coupon_code}', user_id=user_id)
            print(f"DEBUG: Coupon not found: '{coupon_code}'")
            return jsonify({"error": "Invalid coupon code"}), 404
        
        coupon_id = coupon[0]['id']
        coupon_amount = coupon[0]['amount']
        
        print(f"DEBUG: Coupon found - ID: {coupon_id}, Amount: {coupon_amount}")
        
        # Check if user has already redeemed this coupon
        already_redeemed = db.execute(
            "SELECT id FROM transactions WHERE transaction_type = 'redeemed' AND receiver_id = ? AND sender_id = ?",
            user_id, coupon_id
        )
        
        if already_redeemed:
            log_event('WARNING', f'Coupon {coupon_code} already redeemed by user {user_id}', user_id=user_id)
            print(f"DEBUG: Coupon already redeemed by this user")
            return jsonify({"error": "You have already redeemed this coupon"}), 400
        
        # Get current balance
        user = db.execute("SELECT balance, name FROM users WHERE id = ?", user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        current_balance = user[0]['balance']
        user_name = user[0]['name']
        new_balance = current_balance + coupon_amount
        
        # Update user balance
        db.execute("UPDATE users SET balance = balance + ? WHERE id = ?", coupon_amount, user_id)
        
        # Get current time in GMT+5 (Pakistan timezone)
        pk_timezone = pytz.timezone('Asia/Karachi')
        current_time = datetime.now(pk_timezone).strftime('%Y-%m-%d %H:%M:%S')
        
        # Record the redemption in transactions table
        # sender_id = coupon_id for redemptions
        db.execute(
            "INSERT INTO transactions (transaction_type, sender_id, receiver_id, amount, status, note, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)",
            'redeemed', coupon_id, user_id, coupon_amount, 'completed', coupon_code, current_time
        )
        
        log_event('INFO', f'Coupon {coupon_code} redeemed successfully by {user_name} for Rs {coupon_amount}',
                 user_id=user_id, details=f"coupon_id: {coupon_id}, amount: {coupon_amount}")
        
        print(f"DEBUG: Coupon redeemed successfully! New balance: {new_balance}")
        
        return jsonify({
            "message": "Coupon redeemed successfully",
            "coupon_code": coupon_code,
            "amount": coupon_amount,
            "previous_balance": current_balance,
            "new_balance": new_balance
        }), 200
        
    except Exception as e:
        log_event('ERROR', f'Coupon redemption failed for user {user_id}. Error: {e}', user_id=user_id)
        print(f"ERROR: Coupon redemption failed: {e}")
        return jsonify({"error": f"Redemption failed: {str(e)}"}), 500
