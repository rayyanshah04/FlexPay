import os
from cs50 import SQL
from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt #for tokens
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from functools import wraps

load_dotenv()

app = Flask(__name__)
db = SQL("sqlite:///database.db")

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    phone_number = data.get('phone_number')
    password = data.get('password')

    #prints in terminal for debugging
    print(f"Received: {name}, {phone_number}, {password}")

    #checking if user already exists
    existing_user = db.execute("SELECT * FROM users WHERE phone_number = ?", phone_number)
    if existing_user:
        return jsonify({"error": "User already exists"}), 400
    
    #generate password hash
    hash = generate_password_hash(password)

    #if not, insert new user
    db.execute("INSERT INTO users (name, phone_number, password, cash) VALUES (?, ?, ?, ?)", name, phone_number, hash,10000)

    #add into user_profiles table as well
    db.execute("INSERT INTO user_profiles (user_id, name, phone_number) VALUES ((SELECT id FROM users WHERE phone_number = ?), ?, ?)", phone_number, name, phone_number)

    # returning to frontend for later use
    return jsonify({
    "name": name,
    "phone_number": phone_number,
})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    phone_number = data.get('phone_number')
    password = data.get('password')

    #prints in terminal for debugging
    print(f"Received: {phone_number}, {password}")

    #checking if user already exists
    existing_user = db.execute("SELECT * FROM users WHERE phone_number = ?", phone_number)
    if not existing_user:
        return jsonify({"error": "User doesn't exist"}), 400

    #compare passwords hash
    hash = existing_user[0]['password']
    if not check_password_hash(hash, password):
        return jsonify({"error": "Incorrect password"}), 400

    payload = {
        "user_id": existing_user[0]["id"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }
    token = jwt.encode(payload, os.environ['JWT_SECRET'], algorithm="HS256")

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

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, os.environ['JWT_SECRET'], algorithms=["HS256"])
            current_user = db.execute("SELECT * FROM users WHERE id = ?", data['user_id'])[0]
        except Exception as e:
            print(e)
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/balance')
@token_required
def get_balance(current_user):
    user_id = current_user['id']
    balance = db.execute("SELECT cash FROM users WHERE id = ?", user_id)
    if balance:
        cash_value = balance[0]['cash']
        return jsonify({"balance": cash_value})
    return jsonify({"error": "User not found"}), 404



@app.route('/api/add_beneficiary', methods=['POST'])
@token_required
def add_beneficiary(current_user):
    data = request.get_json()
    name = data.get('name')
    iban_or_number = data.get('iban_or_number')
    note = data.get('note')
    user_id = current_user['id']

    is_phone = iban_or_number.startswith('03')
    is_iban = iban_or_number.startswith('PK04')

    #getting user id of the phone number or IBAN
    if is_phone:
        user_id_beneficiary = db.execute("SELECT id FROM user_profiles WHERE phone_number = ?", iban_or_number)
        # if no user found with that phone number
        if not user_id_beneficiary:
            return jsonify({"error": "No user found with that phone number"}), 400
    elif is_iban:
        user_id_beneficiary = db.execute("SELECT id FROM user_profiles WHERE iban = ?", iban_or_number)
        # if no user found with that phone number
        if not user_id_beneficiary:
            return jsonify({"error": "No user found with that phone number"}), 400
    else:
        return jsonify({"error": "Invalid phone number or IBAN format"}), 400
    

    #if user found!
    # check if beneficiary already exists
    existing_beneficiary = db.execute("SELECT * FROM beneficiaries WHERE user_id = ? AND beneficiary_user_id = ?", user_id, user_id_beneficiary[0]['id'])
    if existing_beneficiary:
        return jsonify({"error": "Beneficiary already exists"}), 400
    

    return jsonify({"balance": note})


if __name__ == '__main__':
    # Option 1: For Android Emulator.
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

    # Option 2: For server
    # app.run(debug=True)