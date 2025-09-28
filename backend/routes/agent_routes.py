from flask import Blueprint, request, jsonify
from backend.services.ai_agent_service import AIAgentService

agent_bp = Blueprint('agent_bp', __name__)
ai_service = AIAgentService()

@agent_bp.route('/agent/run', methods=['POST'])
def run_agent():
    """Legacy endpoint for basic agent interaction"""
    payload = request.json or {}
    user_input = payload.get('input', '')
    preferences = payload.get('preferences', {})

    try:
        # Use AI service for recipe generation
        recipe = ai_service.generate_recipe(user_input, preferences)
        response = {"status": "success", "recipe": recipe}
        return jsonify(response), 200
    except Exception as e:
        response = {"status": "error", "message": str(e)}
        return jsonify(response), 500

@agent_bp.route('/agent/ask', methods=['POST'])
def ask_question():
    """Ask the AI agent a cooking question"""
    payload = request.json or {}
    question = payload.get('question', '')
    preferences = payload.get('preferences', {})

    try:
        answer = ai_service.ask_question(question, preferences)
        response = {"status": "success", "answer": answer}
        return jsonify(response), 200
    except Exception as e:
        response = {"status": "error", "message": str(e)}
        return jsonify(response), 500

@agent_bp.route('/agent/suggestions', methods=['POST'])
def get_suggestions():
    """Get recipe suggestions based on preferences"""
    payload = request.json or {}
    preferences = payload.get('preferences', {})
    limit = payload.get('limit', 5)

    try:
        suggestions = ai_service.get_recipe_suggestions(preferences, limit)
        response = {"status": "success", "suggestions": suggestions}
        return jsonify(response), 200
    except Exception as e:
        response = {"status": "error", "message": str(e)}
        return jsonify(response), 500

@agent_bp.route('/agent/validate', methods=['POST'])
def validate_recipe():
    """Validate and improve a recipe for accessibility"""
    payload = request.json or {}
    recipe = payload.get('recipe', {})

    try:
        validated_recipe = ai_service.validate_recipe(recipe)
        response = {"status": "success", "recipe": validated_recipe}
        return jsonify(response), 200
    except Exception as e:
        response = {"status": "error", "message": str(e)}
        return jsonify(response), 500

@agent_bp.route('/agent/health', methods=['GET'])
def health_check():
    """Health check endpoint for the AI agent"""
    try:
        # Check if AI service is initialized
        if ai_service.agent_initialized:
            response = {"status": "healthy", "agent_initialized": True}
            return jsonify(response), 200
        else:
            response = {"status": "unhealthy", "agent_initialized": False}
            return jsonify(response), 503
    except Exception as e:
        response = {"status": "error", "message": str(e)}
        return jsonify(response), 500
