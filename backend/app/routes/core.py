from flask import Blueprint, request, jsonify
from ..database import db
from ..utils import token_required

bp = Blueprint('core', __name__, url_prefix='/api')

@bp.route('/balance')
@token_required
def get_balance(current_user):
    user_id = current_user['id']
    balance = db.execute("SELECT cash FROM users WHERE id = ?", user_id)
    if balance:
        cash_value = balance[0]['cash']
        return jsonify({"balance": cash_value})
    return jsonify({"error": "User not found"}), 404

@bp.route('/add_beneficiary', methods=['POST'])
@token_required
def add_beneficiary(current_user):
    data = request.get_json()
    name = data.get('name')
    iban_or_number = data.get('iban_or_number')
    note = data.get('note')
    user_id = current_user['id']

    # for debugging purposes
    print(f"Received Beneficiary Data:\nName: {name}, IBAN/Number: {iban_or_number}, Note: {note}")

    is_phone = iban_or_number.startswith('03')
    is_iban = iban_or_number.startswith('PK04')
    
    if is_phone:

        # if user is trying to add themselves as beneficiary
        user_id_beneficiary = db.execute("SELECT user_id FROM user_profiles WHERE phone_number = ?", iban_or_number)
        user_own_phone = db.execute("SELECT phone_number FROM user_profiles WHERE user_id = ?", user_id)
        if user_own_phone and user_own_phone[0]['phone_number'] == iban_or_number:
            return jsonify({"error": "I know you love yourself so much :)"}), 400
        
        # if no user found with that phone number
        if not user_id_beneficiary:
            return jsonify({"error": "No user found with that phone number"}), 400
        
    elif is_iban:
        # if user is trying to add themselves as beneficiary
        user_id_beneficiary = db.execute("SELECT user_id FROM user_profiles WHERE iban = ?", iban_or_number)
        user_own_iban = db.execute("SELECT iban FROM user_profiles WHERE user_id = ?", user_id)
        if user_own_iban and user_own_iban[0]['iban'] == iban_or_number:
            return jsonify({"error": "I know you love yourself so much :)"}), 400
        
        # if no user found with that phone number
        if not user_id_beneficiary:
            return jsonify({"error": "No user found with that IBAN"}), 400
        
    # if neither phone nor IBAN
    else:
        return jsonify({"error": "Invalid phone number or IBAN format"}), 400
    
    # if beneficiary already exists
    beneficiary_id = user_id_beneficiary[0]['user_id']
    existing_beneficiary = db.execute("SELECT * FROM beneficiaries WHERE user_id = ? AND beneficiary_user_id = ?", user_id, beneficiary_id)
    if existing_beneficiary:
        return jsonify({"error": "Beneficiary already exists"}), 400
    
    # passing user's actual name if no name field provided
    if not name or name.strip() == "":
        profile = db.execute("SELECT name FROM users WHERE id = ?", beneficiary_id)
        if profile:
            name = profile[0]['name']
        else:
            name = "Unnamed Beneficiary"
    
    # if all checks passed, add beneficiary
    db.execute("INSERT INTO beneficiaries (user_id, beneficiary_user_id, nickname, note) VALUES (?, ?, ?, ?)", user_id, beneficiary_id, name, note)
    
    
    return jsonify({
        "message": "Beneficiary Added Successfully",
        "beneficiary": {
            "name": name,
            "iban_or_number": iban_or_number,
            "note": note
        }
    })

@bp.route('/beneficiaries', methods=['GET'])
@token_required
def get_beneficiaries(current_user):
    user_id = current_user['id']
    
    beneficiaries_data = db.execute(
        """SELECT b.nickname, b.note, u.name, up.phone_number, up.iban
        FROM beneficiaries b
        JOIN users u ON b.beneficiary_user_id = u.id
        LEFT JOIN user_profiles up ON b.beneficiary_user_id = up.user_id
        WHERE b.user_id = ?""",
        user_id
    )

    beneficiaries_list = []
    for beneficiary in beneficiaries_data:
        iban_or_number = None
        if beneficiary['phone_number']:
            iban_or_number = beneficiary['phone_number']
        elif beneficiary['iban']:
            iban_or_number = beneficiary['iban']
            
        beneficiaries_list.append({
            "nickname": beneficiary['nickname'],
            "note": beneficiary['note'],
            "name": beneficiary['name'],
            "iban_or_number": iban_or_number
        })
        
    return jsonify({"beneficiaries": beneficiaries_list})

@bp.route('/search_user')
@token_required
def search_user(current_user):
    query = request.args.get('q', '')
    user_id = current_user['id']

    if not query or (not query.startswith('03') and not query.startswith('PK04')):
        return jsonify({"user": None})

    column = 'phone_number' if query.startswith('03') else 'iban'

    user_data = db.execute(
        f"SELECT u.name, up.{column} FROM users u JOIN user_profiles up ON u.id = up.user_id WHERE up.{column} = ? AND u.id != ?",
        query, user_id
    )

    if user_data:
        found_user = user_data[0]
        result = {
            "nickname": found_user['name'],
            "name": found_user['name'],
            "iban_or_number": found_user[column]
        }
        return jsonify({"user": result})

    return jsonify({"user": None})
