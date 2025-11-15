import jwt
from functools import wraps
from flask import request, jsonify
from .database import db
from .config import JWT_SECRET

def auth_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        if not token:
            return jsonify({'message': 'Auth token is missing!'}), 401
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            if data.get('type') != 'auth':
                return jsonify({'message': 'Invalid token type!'}), 401
            current_user = db.execute("SELECT * FROM users WHERE id = ?", data['user_id'])[0]
        except Exception as e:
            return jsonify({'message': 'Auth token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def session_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        if not token:
            return jsonify({'message': 'Session token is missing!'}), 401
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            if data.get('type') != 'session':
                return jsonify({'message': 'Invalid token type!'}), 401
            current_user = db.execute("SELECT * FROM users WHERE id = ?", data['user_id'])[0]
        except Exception as e:
            return jsonify({'message': 'Session token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated
