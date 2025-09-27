from flask import Flask
from backend.routes import user_bp
from backend.models import db
from backend.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    from backend.routes import user_bp
    app.register_blueprint(user_bp)

    return app
