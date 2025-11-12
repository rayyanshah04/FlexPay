from flask import Flask
from .config import JWT_SECRET

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config['SECRET_KEY'] = JWT_SECRET

    from .routes import auth, core
    app.register_blueprint(auth.bp)
    app.register_blueprint(core.bp)

    return app
