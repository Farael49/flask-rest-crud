from flask import jsonify, request

from . import api
from .. import db
from ..models.user import User
from ..schemas.user import user_schema, users_schema


@api.route('/users', methods=['GET'])
def get_users():
	return jsonify(User.query.all()) 


@api.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    return jsonify(User.query.get(id))


@api.route('/users', methods=['POST'])
def create_user():
    return


@api.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    return


@api.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    return
