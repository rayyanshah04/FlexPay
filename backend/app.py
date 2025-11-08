from cs50 import SQL
from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt #for tokens
import datetime

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
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, "Chachinaychachakochandikaychumchaysaychutnichutai", algorithm="HS256")

    return jsonify({
    "message": "Login successful",
    "token": token,
    "user": {
        "id": existing_user[0]["id"],
        "email": existing_user[0]["email"],
        "name": existing_user[0]["name"],
        "token_expiry": (datetime.datetime.utcnow() + datetime.timedelta(hours=24)).isoformat()

    }
})



if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
    #app.run()