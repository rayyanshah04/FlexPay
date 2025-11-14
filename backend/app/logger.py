from .database import db
from flask import request

def log_event(level, message, user_id=None, details=None):
    """
    Logs an event to the database.
    """
    ip_address = request.remote_addr
    try:
        db.execute(
            "INSERT INTO logs (level, message, user_id, ip_address, details) VALUES (?, ?, ?, ?, ?)",
            level, message, user_id, ip_address, details
        )
    except Exception as e:
        print(f"Failed to log event: {e}")

