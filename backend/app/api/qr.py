from flask import Blueprint, request, jsonify
from ..utils import auth_token_required, session_token_required
from ..logger import log_event
import json

bp = Blueprint('qr', __name__, url_prefix='/api')

# Store QR scan history (in production, save to database)
qr_scans = []

@bp.route('/qr-decode', methods=['POST'])
@auth_token_required
def decode_qr(current_user):
    """Receive and store decoded QR data from mobile app"""
    user_id = current_user['id']
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    raw_data = data.get('raw_data')
    parsed_data = data.get('parsed_data')
    timestamp = data.get('timestamp')
    
    if not raw_data:
        return jsonify({"error": "raw_data is required"}), 400
    
    # Log the scan
    qr_record = {
        'user_id': user_id,
        'raw_data': raw_data,
        'parsed_data': parsed_data,
        'timestamp': timestamp,
    }
    
    qr_scans.append(qr_record)
    
    log_event('INFO', f'QR code scanned by user {user_id}: {raw_data}', user_id=user_id)
    
    # Extract name and phone if available
    extracted_info = {}
    if isinstance(parsed_data, dict):
        extracted_info = {
            'name': parsed_data.get('name'),
            'phone': parsed_data.get('phone'),
        }
    
    return jsonify({
        "message": "QR code received successfully",
        "extracted_info": extracted_info,
        "data": qr_record,
    })


@bp.route('/qr-scans', methods=['GET'])
@session_token_required
def get_qr_scans(current_user):
    """Get all QR scans for the current user"""
    user_id = current_user['id']
    
    user_scans = [scan for scan in qr_scans if scan['user_id'] == user_id]
    
    return jsonify({
        "scans": user_scans,
        "count": len(user_scans),
    })


@bp.route('/qr-scans/latest', methods=['GET'])
@session_token_required
def get_latest_qr_scan(current_user):
    """Get the latest QR scan for the current user"""
    user_id = current_user['id']
    
    user_scans = [scan for scan in qr_scans if scan['user_id'] == user_id]
    
    if not user_scans:
        return jsonify({"error": "No scans found"}), 404
    
    latest_scan = user_scans[-1]
    
    return jsonify({"latest_scan": latest_scan})


@bp.route('/qr/verify-user', methods=['POST'])
@auth_token_required
def verify_user(current_user):
    """Verify if a user exists by phone number from scanned QR code"""
    from ..database import db
    
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    phone = data.get('phone')
    
    if not phone:
        return jsonify({"error": "Phone number is required"}), 400
    
    # Debug logging
    print(f"DEBUG: Verifying user with phone: {phone}")
    
    # Check if user exists in database
    user = db.execute("SELECT id, name, phone_number FROM users WHERE phone_number = ?", phone)
    
    print(f"DEBUG: Query result: {user}")
    
    if not user:
        log_event('INFO', f'QR scan verification failed - user not found: {phone}', user_id=current_user['id'])
        return jsonify({"error": "User not found. This QR code is invalid or the user has deleted their account."}), 404
    
    user_data = user[0]
    
    log_event('INFO', f'QR scan verification successful - user found: {user_data["name"]}', user_id=current_user['id'])
    
    return jsonify({
        "verified": True,
        "user": {
            "name": user_data['name'],
            "phone": user_data['phone_number']
        }
    })

