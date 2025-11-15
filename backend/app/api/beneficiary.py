from flask import Blueprint, request, jsonify
from ..database import db
from ..utils import session_token_required
from ..logger import log_event

bp = Blueprint('beneficiary', __name__, url_prefix='/api')

@bp.route('/add_beneficiary', methods=['POST'])
@session_token_required
def add_beneficiary(current_user):
    data = request.get_json()
    phone_number = data.get('phone_number') or data.get('iban_or_number')
    user_id = current_user['id']

    if not phone_number:
        return jsonify({"error": "Phone number is required"}), 400

    # Extract phone number from IBAN if IBAN format is provided
    # IBAN format: PK04FLXP0000003XXXXXXXXX where X is the phone (last 11 digits)
    if phone_number.startswith('PK04FLXP'):
        phone_number = phone_number[-11:]  # Extract last 11 digits

    # Find the beneficiary user by phone number
    beneficiary_user = db.execute("SELECT id, name, phone_number FROM users WHERE phone_number = ?", phone_number)

    if not beneficiary_user:
        return jsonify({"error": "No user found with that phone number"}), 400

    beneficiary_id = beneficiary_user[0]['id']

    if user_id == beneficiary_id:
        return jsonify({"error": "You cannot add yourself as a beneficiary"}), 400

    existing_beneficiary = db.execute("SELECT * FROM beneficiaries WHERE user_id = ? AND beneficiary_id = ?", user_id, beneficiary_id)
    if existing_beneficiary:
        return jsonify({"error": "Beneficiary already exists"}), 400
    
    db.execute("INSERT INTO beneficiaries (user_id, beneficiary_id) VALUES (?, ?)", user_id, beneficiary_id)
    
    log_event('INFO', f'User {user_id} added beneficiary {beneficiary_id}', user_id=user_id)
    
    return jsonify({
        "message": "Beneficiary Added Successfully",
        "beneficiary": {
            "name": beneficiary_user[0]['name'],
            "phone_number": beneficiary_user[0]['phone_number']
        }
    })

@bp.route('/beneficiaries', methods=['GET'])
@session_token_required
def get_beneficiaries(current_user):
    user_id = current_user['id']
    
    beneficiaries_data = db.execute("SELECT u.name, u.phone_number FROM beneficiaries b JOIN users u ON b.beneficiary_id = u.id WHERE b.user_id = ?", user_id)

    return jsonify({"beneficiaries": beneficiaries_data})

@bp.route('/search_user')
@session_token_required
def search_user(current_user):
    query = request.args.get('q', '')
    user_id = current_user['id']

    if not query:
        return jsonify({"user": None})

    user_data = db.execute(
        "SELECT name, phone_number FROM users WHERE phone_number = ? AND id != ?",
        query, user_id
    )

    if user_data:
        return jsonify({"user": user_data[0]})

    return jsonify({"user": None})

