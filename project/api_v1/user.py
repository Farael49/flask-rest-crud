from flask import jsonify, request

from . import api
from .. import db, bcrypt
from ..models.user import User
from ..schemas.user import user_schema, users_schema, user_schema_secure
from ..validator import validate_json, validate_schema
from ..util import copy_not_null
from flask_login import login_user, logout_user, login_required, current_user

@api.route('/users/login', methods=['GET', 'POST'])
def login():
    credentials = request.get_json()
    user = User.query.filter_by(email=credentials['email']).first()
    if user and bcrypt.check_password_hash(user.password, credentials['password']):
        login_user(user)
        return user_schema.jsonify(user)
    return jsonify({}), 404

@api.route('/users/logout')
@login_required
def logout():
    logout_user()

@api.route('/users', methods=['GET'])
def get_users():
    return users_schema.dumps(User.query.all()) 


@api.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    return user_schema.jsonify(User.query.get(id))


@api.route('/users', methods=['POST'])
@validate_json
#@validate_schema('user_schema')
def create_user():
    scheme = user_schema.load(request.get_json(), partial=True)
    res = scheme.data
    if User.query.filter_by(email=res.email).scalar() is not None:
        return jsonify({}), 409
    if res.email is None or res.password is None:
        return jsonify({}), 400
    if res.username is None:
        res.username = res.email
    res.password = bcrypt.generate_password_hash(res.password)
    #res.created_date = str(datetime.now())
    db.session.add(res)
    db.session.commit()
    return user_schema.jsonify(res)


@api.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    scheme = user_schema_secure.load(request.get_json(), partial=True)  
    #copy_not_null(scheme.data, user)
    #user.id = id
    #user.created_date = None
    user.email = scheme.data.email
    #user = scheme.data
    #user.id = id
    db.session.add(user)
    db.session.commit()
    return user_schema.jsonify(user)


@api.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    User.query.filter_by(id=id).delete()
    db.session.commit()
    return jsonify({}), 200

