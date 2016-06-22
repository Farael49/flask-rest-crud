from flask import jsonify, abort, request
from models import User
from ..api import api_v1


@api_v1.route('/user/', methods = ['GET'])
def get_users():
	return jsonify({'users': User.query.all()})

@api_v1.route('/user/', methods = ['POST'])
def create_user():
    if not request.json or not 'name' in request.json:
        abort(400)
    user = User(request.json.name)
    db.session.add(user)
    db.session.commit()
    return jsonify( { 'user': user } ), 201

