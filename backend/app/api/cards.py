from flask import Blueprint, jsonify, request
from faker import Faker
from ..database import db
from ..utils import session_token_required
from ..logger import log_event

bp = Blueprint('cards', __name__, url_prefix='/api')

# function for generation unique card
def generate_unique_card_number(card_type):
    fake = Faker()

    while True:
        number = fake.credit_card_number(card_type=card_type)
        existing = db.execute(
            "SELECT id FROM cards WHERE card_number = ?", number
        )
        if not existing:
            return number


@bp.route('/has_card', methods=['POST'])
@session_token_required
def has_card(current_user):
    user_id = current_user['id']
    
    # check if user has a card
    user = db.execute("SELECT has_card FROM users WHERE id = ?", user_id)
    
    if user and user[0]['has_card']:
        return jsonify({"has_card": True})
    else:
        return jsonify({"has_card": False})

@bp.route('/get_card', methods=['POST'])
@session_token_required
def get_card(current_user):
    user_id = current_user['id']
    
    # Get the user input from JSON body
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON in request"}), 400
    chosen_card_type = data.get('cardType')
    if not chosen_card_type:
        return jsonify({"error": "Missing cardType in request body"}), 400

    # check if user has card
    user = db.execute("SELECT has_card FROM users WHERE id = ?", user_id)
    if user and user[0]['has_card']:
        return jsonify({"error": "User Already has a Card"}), 409
    

    # making fake card details
    fake = Faker()
    card_type_map = {
        "Mastercard": "mastercard",
        "Visa": "visa",
        "American Express": "amex"
    }
    
    card_type_param = card_type_map.get(chosen_card_type)

    if not card_type_param:
        return jsonify({"error": "Invalid Card Type"}), 400

    card_number = generate_unique_card_number(card_type_param)
    cvc = fake.credit_card_security_code(card_type=card_type_param)
    expiry_date = fake.credit_card_expire()
    
    # adding card flag to databse
    db.execute("UPDATE users SET has_card = 1 WHERE id = ?", user_id)

    #adding card details to database
    db.execute("INSERT INTO cards (user_id, card_number, cvc, expiry_date, card_type) VALUES (?, ?, ?, ?, ?)", user_id, card_number, cvc, expiry_date, chosen_card_type)

    log_event('INFO', f'New card created for user_id: {user_id}, type: {chosen_card_type}', user_id=user_id)
    return jsonify({"message": f"Card type '{chosen_card_type}' created successfully"}), 201

@bp.route('/get_card_details', methods=['POST'])
@session_token_required
def get_card_details(current_user):
    user_id = current_user['id']
    
    card_details_list = db.execute(
        "SELECT c.card_number, c.cvc, c.expiry_date, c.card_type, c.is_frozen, u.name "
        "FROM cards c JOIN users u ON c.user_id = u.id "
        "WHERE c.user_id = ?",
        user_id
    )

    if card_details_list:
        card_details = card_details_list[0]
        card_number = card_details['card_number'].replace(" ", "")
        card_type = card_details['card_type'] or 'unknown'
        
        # Fallback: detect from card number if card_type is not set
        if not card_details['card_type']:
            if card_number.startswith('4'):
                card_type = 'visa'
            elif card_number.startswith('5'):
                card_type = 'mastercard'
            elif card_number.startswith('34') or card_number.startswith('37'):
                card_type = 'amex'

        return jsonify({
            "cardNumber": card_details['card_number'],
            "cardHolderName": card_details['name'],
            "expiryDate": card_details['expiry_date'],
            "cvc": card_details['cvc'],
            "cardType": card_type,
            "isFrozen": bool(card_details.get('is_frozen', 0))
        })
    else:
        return jsonify({"error": "No card found for this user"}), 404

@bp.route('/freeze_card', methods=['POST'])
@session_token_required
def freeze_card(current_user):
    user_id = current_user['id']
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    is_frozen = data.get('isFrozen')
    if is_frozen is None:
        return jsonify({"error": "Missing isFrozen in request body"}), 400
    
    # Check if user has a card
    card = db.execute("SELECT id FROM cards WHERE user_id = ?", user_id)
    if not card:
        return jsonify({"error": "No card found for this user"}), 404
    
    # Update card frozen status
    db.execute("UPDATE cards SET is_frozen = ? WHERE user_id = ?", 1 if is_frozen else 0, user_id)
    
    status = "frozen" if is_frozen else "unfrozen"
    log_event('INFO', f'Card {status} for user_id: {user_id}', user_id=user_id)
    return jsonify({"message": f"Card {status} successfully", "isFrozen": is_frozen}), 200

@bp.route('/delete_card', methods=['POST'])
@session_token_required
def delete_card(current_user):
    user_id = current_user['id']
    
    # Check if user has a card
    card = db.execute("SELECT id FROM cards WHERE user_id = ?", user_id)
    if not card:
        return jsonify({"error": "No card found for this user"}), 404
    
    # Delete the card
    db.execute("DELETE FROM cards WHERE user_id = ?", user_id)
    
    # Update user has_card flag
    db.execute("UPDATE users SET has_card = 0 WHERE id = ?", user_id)
    
    log_event('INFO', f'Card deleted for user_id: {user_id}', user_id=user_id)
    return jsonify({"message": "Card deleted successfully"}), 200