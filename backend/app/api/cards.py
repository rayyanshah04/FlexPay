from flask import Blueprint, jsonify
from ..database import db
from ..utils import token_required

bp = Blueprint('cards', __name__, url_prefix='/api')

@bp.route('/has_card', methods=['GET'])
@token_required
def has_card(current_user):
    user_id = current_user['id']
    
    # check if user has a card
    card = db.execute("SELECT id FROM cards WHERE user_id = ?", user_id)
    
    if card:
        return jsonify({"has_card": True})
    else:
        return jsonify({"has_card": False})
