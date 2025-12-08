from flask import Flask
from .config import JWT_SECRET
import firebase_admin
from firebase_admin import credentials

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config['SECRET_KEY'] = JWT_SECRET

    # Initialize Firebase Admin SDK
    if not firebase_admin._apps:
        try:
            cred = credentials.Certificate("instance/serviceAccountKey.json")
            firebase_admin.initialize_app(cred)
        except Exception as e:
            print(f"Error initializing Firebase Admin SDK: {e}")

    from .api import auth, user, beneficiary, cards, transactions, qr
    app.register_blueprint(auth.bp)
    app.register_blueprint(user.bp)
    app.register_blueprint(beneficiary.bp)
    app.register_blueprint(cards.bp)
    app.register_blueprint(transactions.bp)
    app.register_blueprint(qr.bp)

    from .admin import admin_bp
    app.register_blueprint(admin_bp)

    return app
