from flask_socketio import emit, join_room, leave_room
import json
import asyncio
from backend.services.ai_agent_service import AIAgentService

class AgentSocketHandler:
    def __init__(self):
        self.ai_service = AIAgentService()
        self.active_sessions = {}

    def handle_connect(self, data=None):
        """Handle client connection"""
        session_id = data.get('session_id') if data else None
        if session_id:
            join_room(session_id)
            self.active_sessions[session_id] = {
                'status': 'connected',
                'user_preferences': None
            }
            emit('connected', {'message': 'Connected to AI agent', 'session_id': session_id})
        else:
            emit('error', {'message': 'Session ID required'})

    def handle_disconnect(self, data=None):
        """Handle client disconnection"""
        session_id = data.get('session_id') if data else None
        if session_id and session_id in self.active_sessions:
            leave_room(session_id)
            del self.active_sessions[session_id]
            emit('disconnected', {'message': 'Disconnected from AI agent'})

    def handle_generate_recipe(self, data):
        """Handle recipe generation request"""
        session_id = data.get('session_id')
        user_input = data.get('input', '')
        user_preferences = data.get('preferences', {})
        
        if not session_id:
            emit('error', {'message': 'Session ID required'})
            return

        # Update user preferences for this session
        if session_id in self.active_sessions:
            self.active_sessions[session_id]['user_preferences'] = user_preferences

        # Emit progress updates
        emit('recipe_progress', {
            'status': 'processing',
            'message': 'Analyzing your request...',
            'progress': 10
        }, room=session_id)

        try:
            # Generate recipe using AI agent
            recipe = self.ai_service.generate_recipe(
                user_input=user_input,
                preferences=user_preferences,
                progress_callback=lambda progress, message: emit('recipe_progress', {
                    'status': 'processing',
                    'message': message,
                    'progress': progress
                }, room=session_id)
            )

            # Send final recipe
            emit('recipe_complete', {
                'status': 'success',
                'recipe': recipe,
                'message': 'Recipe generated successfully!'
            }, room=session_id)

        except Exception as e:
            emit('recipe_error', {
                'status': 'error',
                'message': f'Failed to generate recipe: {str(e)}'
            }, room=session_id)

    def handle_ask_question(self, data):
        """Handle cooking questions"""
        session_id = data.get('session_id')
        question = data.get('question', '')
        
        if not session_id:
            emit('error', {'message': 'Session ID required'})
            return

        try:
            # Get user preferences for context
            preferences = self.active_sessions.get(session_id, {}).get('user_preferences', {})
            
            # Ask AI agent
            answer = self.ai_service.ask_question(
                question=question,
                preferences=preferences
            )

            emit('question_answer', {
                'status': 'success',
                'question': question,
                'answer': answer
            }, room=session_id)

        except Exception as e:
            emit('question_error', {
                'status': 'error',
                'message': f'Failed to answer question: {str(e)}'
            }, room=session_id)

    def handle_update_preferences(self, data):
        """Handle user preference updates"""
        session_id = data.get('session_id')
        preferences = data.get('preferences', {})
        
        if not session_id:
            emit('error', {'message': 'Session ID required'})
            return

        if session_id in self.active_sessions:
            self.active_sessions[session_id]['user_preferences'] = preferences
            emit('preferences_updated', {
                'status': 'success',
                'message': 'Preferences updated successfully'
            }, room=session_id)
        else:
            emit('error', {'message': 'Session not found'})

# Global instance
agent_handler = AgentSocketHandler()
