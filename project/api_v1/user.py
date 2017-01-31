from flask import jsonify, request

from . import api
from .. import db, bcrypt, login_manager
from ..models.user import User
from ..schemas.user import user_schema, users_schema, user_schema_secure, users_schema_secure
from ..validator import validate_json, validate_schema
from ..util import copy_not_null
from flask_login import login_user, logout_user, login_required, current_user

@login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.id == int(user_id)).first()

@api.route('/users/login', methods=['POST'])
def login():
    """
    Login function
    ---
    consumes:
      - application/json
    tags:
      - users
    parameters:
      - name: email
        in: body
	required: true
        schema:
          id: user_login
          properties:
            email:
              type: string
            password:
              type: string
          required: [email, password]
          example:
            email: ""
            password: ""
    responses:
      401:
       description: Authentication failed
    """
    credentials = request.get_json()
    user = User.query.filter_by(email=credentials['email']).first()
    if user and bcrypt.check_password_hash(user.password, credentials['password']):
        login_user(user)
        return user_schema_secure.jsonify(user)
    return jsonify({}), 401

@api.route('/users/logout')
@login_required
def logout():
    logout_user()
    return jsonify({}), 200

@api.route('/users', methods=['GET'])
@login_required
def get_users():
    return users_schema_secure.dumps(User.query.all()) 

@api.route('/users/logged')
@login_required
def get_current_user():
    return user_schema_secure.jsonify(current_user)

@api.route('/users/<int:id>', methods=['GET'])
@login_required
def get_user(id):
    user = User.query.get(id)
    if user is not None:
        return user_schema_secure.jsonify(User.query.get(id))
    return jsonify({}), 404

@api.route('/users', methods=['POST'])
@validate_json
@login_required
def create_user():
    """
    Create a user
    ---
    consumes:
      - application/json
    tags:
      - users
    parameters:
      - name: user
        in: body
        required: true
        schema:
          type: object
          id: user_create
          properties:
            email:
              type: string
            password:
              type: string
          example:
            email: ""
            password: ""
    responses:
      401:
       description: Authentication failed
    """ 
    scheme = user_schema.load(request.get_json(), partial=True)
    res = scheme.data
    if not res.email or not res.password:
        return jsonify({}), 400
    if User.query.filter_by(email=res.email).first() is not None:
        return user_schema_secure.jsonify(User.query.filter_by(email=res.email).first()), 409
    db.session.add(User(res.email, bcrypt.generate_password_hash(res.password), res.username))
    db.session.commit()
    return user_schema_secure.jsonify(res)


@api.route('/users/<int:id>', methods=['PUT'])
@login_required
def update_user(id):
    user = User.query.get(id)
    scheme = user_schema_secure.load(request.get_json(), partial=True)  
    #copy_not_null(scheme.data, user)
    #user.id = id
    #user.created_date = None
    #user.email = scheme.data.email
    #user = scheme.data
    #user.id = id
    #user.roles = []
    db.session.add(user)
    db.session.commit()
    return user_schema_secure.jsonify(user)


@api.route('/users/<int:id>', methods=['DELETE'])
@login_required
def delete_user(id):
    User.query.filter_by(id=id).delete()
    db.session.commit()
    return jsonify({}), 200

