from flask import Flask
from flask_socketio import SocketIO
from backend.routes import user_bp, agent_bp
from backend.models import db
from backend.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize database
    db.init_app(app)
    
    # Initialize SocketIO
    socketio = SocketIO(app, cors_allowed_origins="*")
    
    # Register blueprints
    app.register_blueprint(user_bp)
    app.register_blueprint(agent_bp)
    
    # Import and register socket events
    from backend.sockets import register_socket_events
    register_socket_events(socketio)

    return app, socketio
