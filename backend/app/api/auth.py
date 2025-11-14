from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta, timezone
from ..database import db
from ..config import JWT_SECRET
from ..logger import log_event

bp = Blueprint('auth', __name__, url_prefix='/api')

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    name = data.get('name')
    email = data.get('email')
    phone_number = data.get('phone_number')
    password = data.get('password')
    
    if not name:
        return jsonify({"error": "Name is required"}), 400
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    if not phone_number:
        return jsonify({"error": "Phone number is required"}), 400
    
    if not password:
        return jsonify({"error": "Password is required"}), 400
    
    name = name.title()

    # Basic email validation
    if '@' not in email or '.' not in email:
        return jsonify({"error": "Invalid email format"}), 400

    # Check if user already exists with the same phone number
    existing_user = db.execute("SELECT * FROM users WHERE phone_number = ?", phone_number)
    if existing_user:
        return jsonify({"error": "User with this phone number account already exists"}), 400
    
    # check if user already exists with the same email
    existing_email = db.execute("SELECT * FROM users WHERE email = ?", email)
    if existing_email:
        return jsonify({"error": "User with this email already exists"}), 400
    
    hash = generate_password_hash(password)

    user_id = db.execute("INSERT INTO users (name, email, phone_number, password) VALUES (?, ?, ?, ?)", name, email, phone_number, hash)

    log_event('INFO', f'New user signed up: {name}', user_id=user_id)

    return jsonify({
        "name": name,
        "email": email,
        "phone_number": phone_number,
    })

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    phone_number = data.get('phone_number')
    password = data.get('password')
    
    if not phone_number:
        return jsonify({"error": "Phone number is required"}), 400
    
    if not password:
        return jsonify({"error": "Password is required"}), 400

    existing_user = db.execute("SELECT * FROM users WHERE phone_number = ?", phone_number)
    if not existing_user:
        log_event('WARNING', f'Failed login attempt for non-existent user with phone: {phone_number}')
        return jsonify({"error": "User doesn't exist"}), 400

    user_id = existing_user[0]["id"]
    hash = existing_user[0]['password']
    if not check_password_hash(hash, password):
        log_event('WARNING', f'Failed login attempt for user: {existing_user[0]["name"]}', user_id=user_id)
        return jsonify({"error": "Incorrect password"}), 400

    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    log_event('INFO', f'User logged in: {existing_user[0]["name"]}', user_id=user_id)

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user_id,
            "phone_number": existing_user[0]["phone_number"],
            "name": existing_user[0]["name"],
            "email": existing_user[0]["email"],
            "token_expiry": (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
        }
    })
