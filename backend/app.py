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
    email = data.get('email')
    password = data.get('password')

    #prints in terminal for debugging
    print(f"Received: {name}, {email}, {password}")

    #checking if user already exists
    existing_user = db.execute("SELECT * FROM users WHERE email = ?", email)
    if existing_user:
        return jsonify({"error": "User already exists"}), 400
    
    #generate password hash
    hash = generate_password_hash(password)

    #if not, insert new user
    db.execute("INSERT INTO users (name, email, password, cash) VALUES (?, ?, ?, ?)", name, email, hash,10000)

    # returning to frontend for later use
    return jsonify({
    "name": name,
    "email": email,
})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    #prints in terminal for debugging
    print(f"Received: {email}, {password}")

    #checking if user already exists
    existing_user = db.execute("SELECT * FROM users WHERE email = ?", email)
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
        "email": existing_user[0]["email"],
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
    phone = data.get('phone')
    iban = data.get('iban')
    note = data.get('note')
    user_id = current_user['id']

    #check if number is already in beneficiaries for this user
    existing_beneficiary = db.execute("SELECT * FROM beneficiaries WHERE user_id = ? AND phone = ?", user_id, phone)
    if existing_beneficiary:
        return jsonify({"error": "Beneficiary with this phone number already exists"}), 400
    
    #check if IBAN is already in beneficiaries for this user
    existing_iban = db.execute("SELECT * FROM beneficiaries WHERE user_id = ? AND iban = ?", user_id, iban)
    if existing_iban:
        return jsonify({"error": "Beneficiary with this IBAN already exists"}), 400
    
    #check if user is adding themselves
    user = db.execute("SELECT * FROM users WHERE id = ?", user_id)[0]
    if user['phone'] == phone or user['iban'] == iban:
        return jsonify({"error": "We know you love yourself, but you cant add yourself in your benefeciaries"}), 400
    
    #check if phone number/IBAN exists in users table


    print(f"User with ID {user_id} is adding a beneficiary with the following details:")
    print(f"Name: {name}")
    print(f"Phone: {phone}")
    print(f"IBAN: {iban}")
    print(f"Note: {note}")

    # HOW TO RETURN AN ERROR:
    # If validation fails, you can return a JSON response with an error message and a 4xx status code.
    # The frontend will be able to catch this and display the error.
    # For example, if the IBAN is invalid:
    # if not is_valid_iban(iban):
    #     return jsonify({"error": "The provided IBAN is not valid."}), 400

    # For now, we'll just simulate a success response.
    # In a real application, you would insert the data into your 'beneficiaries' table here.
    
    return jsonify({"message": "Beneficiary added successfully!"}), 200


if __name__ == '__main__':
    # Option 1: For Android Emulator.
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

    # Option 2: For server
    # app.run(debug=True)