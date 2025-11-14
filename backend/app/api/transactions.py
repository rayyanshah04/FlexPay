from flask import Blueprint, request, jsonify
from ..database import db
from ..utils import token_required
from ..logger import log_event

bp = Blueprint('transactions', __name__, url_prefix='/api')

@bp.route('/transactions/send', methods=['POST'])
@token_required
def send_money(current_user):
    data = request.get_json()
    receiver_phone = data.get('receiver_phone')
    amount = data.get('amount')
    note = data.get('note', '')
    sender_id = current_user['user_id']

    if not receiver_phone or not amount:
        return jsonify({"error": "Receiver phone number and amount are required"}), 400

    try:
        amount = float(amount)
        if amount <= 0:
            return jsonify({"error": "Amount must be positive"}), 400
    except ValueError:
        return jsonify({"error": "Invalid amount"}), 400

    # Get receiver with name
    receiver = db.execute("SELECT id, name, phone_number FROM users WHERE phone_number = ?", receiver_phone)
    if not receiver:
        return jsonify({"error": "Receiver not found"}), 404
    receiver_id = receiver[0]['id']
    receiver_name = receiver[0]['name']

    if sender_id == receiver_id:
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
        # Perform atomic transaction
        db.execute("UPDATE users SET balance = balance - ? WHERE id = ?", amount, sender_id)
        db.execute("UPDATE users SET balance = balance + ? WHERE id = ?", amount, receiver_id)
        
        # Insert transaction record
        result = db.execute(
            "INSERT INTO transactions (sender_id, receiver_id, amount, status) VALUES (?, ?, ?, ?)",
            sender_id, receiver_id, amount, 'completed'
        )
        
        # Get transaction ID
        transaction_id = db.execute("SELECT last_insert_rowid() as id")[0]['id']
        
        log_event('INFO', f'Transaction from {sender_id} to {receiver_id} for {amount}', 
                 user_id=sender_id, details=f"receiver_id: {receiver_id}, amount: {amount}, txn_id: {transaction_id}")
        
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
@token_required
def get_transactions(current_user):
    user_id = current_user['user_id']
    
    transactions = db.execute(
        "SELECT t.id, t.amount, t.timestamp, t.status, "
        "s.username as sender_username, r.username as receiver_username "
        "FROM transactions t "
        "JOIN users s ON t.sender_id = s.id "
        "JOIN users r ON t.receiver_id = r.id "
        "WHERE t.sender_id = ? OR t.receiver_id = ? "
        "ORDER BY t.timestamp DESC",
        user_id, user_id
    )

    return jsonify({"transactions": transactions})
