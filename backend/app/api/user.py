from flask import Blueprint, jsonify
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

