from flask import Blueprint, jsonify, request
from faker import Faker
from ..database import db
from ..utils import token_required

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
@token_required
def has_card(current_user):
    user_id = current_user['id']
    
    # check if user has a card
    card = db.execute("SELECT id FROM cards WHERE user_id = ?", user_id)
    
    if card:
        return jsonify({"has_card": True})
    else:
        return jsonify({"has_card": False})

@bp.route('/get_card', methods=['POST'])
@token_required
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
    has_card_list = db.execute("SELECT id FROM cards WHERE user_id = ?", user_id)
    if has_card_list:
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
    db.execute("UPDATE user_profiles SET has_card = 1 WHERE user_id = ?", user_id)

    #adding card details to database
    db.execute("INSERT INTO cards (user_id, card_number, cvc, expiry_date) VALUES (?, ?, ?, ?)", user_id, card_number, cvc, expiry_date)

    return jsonify({"message": f"Card type '{chosen_card_type}' created successfully"}), 201

@bp.route('/get_card_details', methods=['POST'])
@token_required
def get_card_details(current_user):
    user_id = current_user['id']
    
    card_details_list = db.execute(
        "SELECT c.card_number, c.cvc, c.expiry_date, u.name "
        "FROM cards c JOIN users u ON c.user_id = u.id "
        "WHERE c.user_id = ?",
        user_id
    )

    if card_details_list:
        card_details = card_details_list[0]
        card_number = card_details['card_number'].replace(" ", "")
        card_type = 'unknown'
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
            "cardType": card_type
        })
    else:
        return jsonify({"error": "No card found for this user"}), 404