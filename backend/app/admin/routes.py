from flask import render_template, request, redirect, url_for, flash, session
from werkzeug.security import check_password_hash
from cs50 import SQL
from functools import wraps
import secrets
from app.database import db
from . import admin_bp
from datetime import datetime, timedelta

db = SQL("sqlite:///instance/database.db")

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/')
@admin_bp.route('/dashboard')
@login_required
def dashboard():
    # top cards
    total_users = db.execute("SELECT COUNT(*) FROM users")[0]['COUNT(*)']
    cards_issued = db.execute("SELECT COUNT(*) FROM cards")[0]['COUNT(*)']
    total_volume = db.execute("SELECT SUM(balance) AS total_volume FROM users;")[0]['total_volume']
    total_volume = round(total_volume, 2) if total_volume is not None else 0

    average_transaction = db.execute("SELECT AVG(amount) AS average_transaction FROM transactions;")[0]['average_transaction']
    average_transaction = round(average_transaction, 2) if average_transaction is not None else 0

    
    # new users
    query = db.execute("SELECT name, created_at FROM users ORDER BY created_at DESC LIMIT 3;")
    new_users = []
    for user in query:
        created_dt = datetime.strptime(user['created_at'], "%Y-%m-%d %H:%M:%S")
        
        # calculating time difference
        diff = datetime.now() - created_dt
        days = diff.days
        seconds = diff.seconds

        # formatting time ago
        if days >= 30:
            months = days // 30
            time_ago = f"{months} month" + ("s" if months > 1 else "")
        elif days >= 1:
            time_ago = f"{days} day" + ("s" if days > 1 else "")
        elif seconds >= 3600:
            hours = seconds // 3600
            time_ago = f"{hours} hour" + ("s" if hours > 1 else "")
        elif seconds >= 60:
            minutes = seconds // 60
            time_ago = f"{minutes} minute" + ("s" if minutes > 1 else "")
        else:
            time_ago = "just now"

        # getting first letters
        words = user['name'].split()
        if len(words) == 1:
            letters = words[0][0]
        else:
            letters = words[0][0] + words[1][0]

        # appending
        new_users.append({
            'letters': letters.upper(),
            'name': user['name'],
            'created_at': time_ago
        })

    # recent transactions
    query = db.execute("SELECT transaction_type, sender_id, receiver_id, amount, timestamp, transaction_id FROM transactions ORDER BY timestamp DESC LIMIT 6;")
    recent_transactions = []
    for user in query:
        if len(recent_transactions) >= 3:  # stop after 3 entries
            break
        dt = datetime.strptime(user["timestamp"], "%Y-%m-%d %H:%M:%S")
        time = dt.strftime("%I:%M %p")
        diff = datetime.now() - dt
        days = diff.days
        minute = diff.seconds // 60

        if days == 0:
            time = time
        elif days == 1:
            time = f"Yesterday"
        else:
            time = f"{days} days ago"

        if user["transaction_type"] == "sent":
            name = db.execute("SELECT name FROM users WHERE id = ?", user["sender_id"])[0]
            recent_transactions.append({
                "name" : name["name"],
                "amount" : user["amount"],
                "time" : time,
                "type" : "red"
            })
        elif user["transaction_type"] == "redeemed":
            name = db.execute("SELECT name FROM users WHERE id = ?", user["receiver_id"])[0]
            recent_transactions.append({
                "name" : name["name"],
                "amount" : user["amount"],
                "time" : time,
                "type" : "green"
            })
        else:
            continue
        
    print(recent_transactions)

    return render_template('admin/dashboard.html',
    total_users=total_users, 
    cards_issued=cards_issued, 
    total_volume=total_volume, 
    average_transaction=average_transaction,
    new_users=new_users,
    recent_transactions=recent_transactions)

@admin_bp.route('/settings')
@login_required
def settings():
    return render_template('admin/settings.html')




# coupons
@admin_bp.route('/coupons')
@login_required
def coupons():
    # Fetch all coupons from database
    all_coupons = db.execute("SELECT * FROM coupons ORDER BY amount DESC")
    
    # Calculate stats
    total_coupons = len(all_coupons)
    highest_value = all_coupons[0]['amount'] if all_coupons else 0
    total_amount = sum(coupon['amount'] for coupon in all_coupons)
    
    return render_template('admin/coupons.html', 
                         coupons=all_coupons,
                         total_coupons=total_coupons,
                         highest_value=highest_value,
                         total_amount=total_amount)

@admin_bp.route('/coupons/add', methods=['POST'])
@login_required
def add_coupon():
    coupon_code = request.form.get('coupon_code').upper()
    amount = request.form.get('amount')
    
    try:
        db.execute("INSERT INTO coupons (coupon_code, amount) VALUES (?, ?)", 
                   coupon_code, amount)
        flash(f'Coupon {coupon_code} created successfully!', 'success')
    except Exception as e:
        flash(f'Error: Coupon code already exists!', 'error')
    
    return redirect(url_for('admin.coupons'))

@admin_bp.route('/coupons/edit', methods=['POST'])
@login_required
def edit_coupon():
    coupon_id = request.form.get('coupon_id')
    coupon_code = request.form.get('coupon_code').upper()
    amount = request.form.get('amount')
    
    try:
        db.execute("UPDATE coupons SET coupon_code = ?, amount = ? WHERE id = ?",
                   coupon_code, amount, coupon_id)
        flash(f'Coupon updated successfully!', 'success')
    except Exception as e:
        flash(f'Error updating coupon!', 'error')
    
    return redirect(url_for('admin.coupons'))

@admin_bp.route('/coupons/delete/<int:coupon_id>')
@login_required
def delete_coupon(coupon_id):
    try:
        db.execute("DELETE FROM coupons WHERE id = ?", coupon_id)
        flash('Coupon deleted successfully!', 'success')
    except Exception as e:
        flash('Error deleting coupon!', 'error')
    
    return redirect(url_for('admin.coupons'))



# authentication
@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = db.execute("SELECT * FROM admins WHERE username = ?", username)
        
        if user and check_password_hash(user[0]['password_hash'], password):
            session['admin_id'] = user[0]['id']
            session['admin_username'] = user[0]['username']
            return redirect(url_for('admin.dashboard'))
        else:
            flash('Invalid username or password')
            
    return render_template('admin/login.html')

@admin_bp.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect(url_for('admin.login'))


# Notifications
@admin_bp.route('/notifications')
@login_required
def notifications():
    """Display notification panel with form and history"""
    # Get all users for dropdown
    users = db.execute("SELECT id, name, phone_number FROM users ORDER BY name")
    
    # Get stats
    total_users = len(users)
    devices_with_tokens = db.execute("SELECT COUNT(*) FROM users WHERE device_token IS NOT NULL")[0]['COUNT(*)']
    
    # Get today's notifications sent
    today = datetime.now().strftime('%Y-%m-%d')
    notifications_sent_today = db.execute(
        "SELECT COUNT(*) FROM notification_logs WHERE DATE(sent_at) = ?", 
        today
    )[0]['COUNT(*)']
    
    # Get notification history
    history_query = db.execute("""
        SELECT 
            nl.*,
            u.name as recipient_name
        FROM notification_logs nl
        LEFT JOIN users u ON nl.recipient_id = u.id
        ORDER BY nl.sent_at DESC
        LIMIT 50
    """)
    
    notification_history = []
    for notif in history_query:
        # Format timestamp
        dt = datetime.strptime(notif['sent_at'], "%Y-%m-%d %H:%M:%S")
        time_ago = dt.strftime("%b %d, %I:%M %p")
        
        notification_history.append({
            'title': notif['title'],
            'message': notif['message'],
            'target_type': notif['target_type'],
            'recipient_name': notif['recipient_name'] if notif['recipient_name'] else 'All Users',
            'recipient_count': notif['recipient_count'],
            'status': notif['status'],
            'sent_at': time_ago
        })
    
    return render_template('notifications.html',
                         users=users,
                         total_users=total_users,
                         devices_with_tokens=devices_with_tokens,
                         notifications_sent_today=notifications_sent_today,
                         notification_history=notification_history)

@admin_bp.route('/notifications/send', methods=['POST'])
@login_required
def send_notification():
    """Send push notification to users"""
    from ..config import FCM_API_KEY
    from pyfcm.fcm import FCMNotification
    
    title = request.form.get('title')
    message = request.form.get('message')
    target_type = request.form.get('target_type')  # 'all' or 'specific'
    user_id = request.form.get('user_id')
    custom_data = request.form.get('custom_data', '{}')
    
    if not title or not message:
        flash('Title and message are required!', 'error')
        return redirect(url_for('admin.notifications'))
    
    if target_type == 'specific' and not user_id:
        flash('Please select a user!', 'error')
        return redirect(url_for('admin.notifications'))
    
    try:
        # Parse custom data
        import json
        try:
            data_payload = json.loads(custom_data) if custom_data else {}
        except:
            data_payload = {}
        
        data_payload.update({
            'type': 'admin_notification',
            'title': title,
            'message': message
        })
        
        recipient_count = 0
        status = 'sent'
        
        if FCM_API_KEY:
            push_service = FCMNotification(api_key=FCM_API_KEY)
            
            if target_type == 'all':
                # Get all device tokens
                users = db.execute("SELECT device_token FROM users WHERE device_token IS NOT NULL")
                device_tokens = [user['device_token'] for user in users]
                
                if device_tokens:
                    # Send to multiple devices
                    result = push_service.notify_multiple_devices(
                        registration_ids=device_tokens,
                        message_title=title,
                        message_body=message,
                        data_message=data_payload
                    )
                    recipient_count = len(device_tokens)
                    print(f"DEBUG: Sent notification to {recipient_count} devices. Result: {result}")
                else:
                    flash('No devices with tokens found!', 'error')
                    return redirect(url_for('admin.notifications'))
            
            else:  # specific user
                user = db.execute("SELECT device_token, name FROM users WHERE id = ?", user_id)
                if user and user[0]['device_token']:
                    result = push_service.notify_single_device(
                        registration_id=user[0]['device_token'],
                        message_title=title,
                        message_body=message,
                        data_message=data_payload
                    )
                    recipient_count = 1
                    print(f"DEBUG: Sent notification to {user[0]['name']}. Result: {result}")
                else:
                    flash('User has no registered device!', 'error')
                    return redirect(url_for('admin.notifications'))
        else:
            flash('FCM_API_KEY not configured!', 'error')
            return redirect(url_for('admin.notifications'))
        
        # Log notification
        db.execute("""
            INSERT INTO notification_logs 
            (title, message, target_type, recipient_id, recipient_count, status, sent_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, title, message, target_type, 
            user_id if target_type == 'specific' else None,
            recipient_count, status, datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        
        flash(f'Notification sent successfully to {recipient_count} device(s)!', 'success')
        
    except Exception as e:
        print(f"ERROR: Failed to send notification: {e}")
        flash(f'Error sending notification: {str(e)}', 'error')
    
    return redirect(url_for('admin.notifications'))

