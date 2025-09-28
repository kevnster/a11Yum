from flask_socketio import emit
from .agent_sockets import agent_handler

def register_socket_events(socketio):
    """Register all SocketIO event handlers"""
    
    @socketio.on('connect')
    def handle_connect(data=None):
        agent_handler.handle_connect(data)
    
    @socketio.on('disconnect')
    def handle_disconnect(data=None):
        agent_handler.handle_disconnect(data)
    
    @socketio.on('generate_recipe')
    def handle_generate_recipe(data):
        agent_handler.handle_generate_recipe(data)
    
    @socketio.on('ask_question')
    def handle_ask_question(data):
        agent_handler.handle_ask_question(data)
    
    @socketio.on('update_preferences')
    def handle_update_preferences(data):
        agent_handler.handle_update_preferences(data)
    
    @socketio.on('ping')
    def handle_ping():
        emit('pong', {'message': 'Server is alive'})