from flask import Flask
from .config import JWT_SECRET

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config['SECRET_KEY'] = JWT_SECRET

    from .api import auth, user, beneficiary, cards
    app.register_blueprint(auth.bp)
    app.register_blueprint(user.bp)
    app.register_blueprint(beneficiary.bp)
    app.register_blueprint(cards.bp)

    return app
