from flask import jsonify, request

from . import api
from .. import db
from ..models.user import User
from ..schemas.user import user_schema, users_schema, user_schema_secure
import copy

@api.route('/users', methods=['GET'])
def get_users():
    return users_schema.dumps(User.query.all()) 


@api.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    return user_schema.jsonify(User.query.get(id))


@api.route('/users', methods=['POST'])
def create_user():
    scheme = user_schema.load(request.get_json(), partial=True)
    res = scheme.data
    db.session.add(res)
    db.session.commit()
    return user_schema.jsonify(res)


@api.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    scheme = user_schema_secure.load(request.get_json(), partial=True)  
    #copyNotNull(scheme.data, user)
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


def copyNotNull(fromA, toB):
    if type(fromA) is type(toB):
        for k, v in fromA.__class__.__dict__.items():
            if v is not None:
                setattr(toB, k.name, v)
            else:
                print(k + ' property is ' + v)
    else:
        print('WOOOOOOOOOOOOOOOOOOOW NOT COOL BRO') 