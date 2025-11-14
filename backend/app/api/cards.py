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

@bp.route('/get_card', methods=['GET'])
@token_required
def get_card(current_user):
    user_id = current_user['id']
    
    # Get the user input
    chosen_card_type = request.args.get('cardType')

    # checkkiing if user has card
    has_card = db.execute("SELECT id FROM cards WHERE user_id = ?", user_id)
    if has_card:
        return jsonify({"error": "User Already has a Card"})
    

    # making fake card details
    fake = Faker()
    if chosen_card_type == "Mastercard":
        card_number = generate_unique_card_number('mastercard')
        cvc = fake.credit_card_security_code(card_type='mastercard')
        expiry_date = fake.credit_card_expire()

    elif chosen_card_type == "Visa":
        card_number = generate_unique_card_number('visa')
        cvc = fake.credit_card_security_code(card_type='visa')
        expiry_date = fake.credit_card_expire()
        
    elif chosen_card_type == "American Express":
        card_number = generate_unique_card_number('amex')
        cvc = fake.credit_card_security_code(card_type='amex')
        expiry_date = fake.credit_card_expire()

    else:
        return jsonify({"error": "Invalid Cart Type"}), 400
    
    
    # adding card flag to databse
    db.execute("UPDATE user_profiles SET has_card = 1 WHERE user_id = ?", user_id)

    #adding card details to database
    db.execute("INSERT INTO cards (user_id, card_number, cvc, expiry_date) VALUES (?, ?, ?, ?)", user_id, card_number, cvc, expiry_date)

    return jsonify({"message": f"Card type '{chosen_card_type}'"}), 200