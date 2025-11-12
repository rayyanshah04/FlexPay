from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta, timezone
from ..database import db
from ..config import JWT_SECRET

bp = Blueprint('auth', __name__, url_prefix='/api')

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = (data.get('name')).title()
    email = data.get('email')
    phone_number = data.get('phone_number')
    password = data.get('password')

    # for debugging purposes
    print(f"Signup Data:\nName: {name}, Email: {email}, Phone Number: {phone_number}, Password: {password}")

    # Basic email validation
    if not email or '@' not in email or '.' not in email:
        return jsonify({"error": "Invalid email format"}), 400

    # Check if user already exists with the same phone number
    existing_user = db.execute("SELECT * FROM users WHERE phone_number = ?", phone_number)
    if existing_user:
        return jsonify({"error": "User with this phone number account already exists"}), 400
    
    # check if user already exists with the same email
    existing_email = db.execute("SELECT * FROM user_profiles WHERE email = ?", email)
    if existing_email:
        return jsonify({"error": "User with this email already exists"}), 400
    
    hash = generate_password_hash(password)
    iban = "PK04PK04FLXP00000" + phone_number

    db.execute("INSERT INTO users (name, phone_number, password, cash) VALUES (?, ?, ?, ?)", name, phone_number, hash, 10000)
    db.execute("INSERT INTO user_profiles (user_id, email, phone_number, iban) VALUES ((SELECT id FROM users WHERE phone_number = ?), ?, ?, ?)", phone_number, email, phone_number, iban)

    return jsonify({
        "name": name,
        "email": email,
        "phone_number": phone_number,
    })

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    phone_number = data.get('phone_number')
    password = data.get('password')

    # for debugging purposes
    print(f"Entered Phone Number: {phone_number}, Password: {password}")

    existing_user = db.execute("SELECT * FROM users WHERE phone_number = ?", phone_number)
    if not existing_user:
        return jsonify({"error": "User doesn't exist"}), 400

    hash = existing_user[0]['password']
    if not check_password_hash(hash, password):
        return jsonify({"error": "Incorrect password"}), 400

    payload = {
        "user_id": existing_user[0]["id"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": existing_user[0]["id"],
            "phone_number": existing_user[0]["phone_number"],
            "name": existing_user[0]["name"],
            "token_expiry": (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
        }
    })
