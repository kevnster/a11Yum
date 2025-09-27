from flask import Blueprint, jsonify
from backend.services.user_service import get_all_users

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users', methods=['GET'])
def users():
    return jsonify({"users": get_all_users()})
