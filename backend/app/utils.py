import jwt
from functools import wraps
from flask import request, jsonify
from .database import db
from .config import JWT_SECRET

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = db.execute("SELECT * FROM users WHERE id = ?", data['user_id'])[0]
        except Exception as e:
            print(e) # Should be replaced with logging
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated
