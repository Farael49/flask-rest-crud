from flask import jsonify, request

from . import api
from .. import db
from ..models.user import Role
from ..schemas.role import role_schema, roles_schema
from ..schemas.authority import authorities_schema
from ..validator import validate_json, validate_schema
from ..util import copy_not_null

@api.route('/roles', methods=['GET'])
def get_roles():
    return roles_schema.dumps(Role.query.all()) 


@api.route('/roles/<int:id>', methods=['GET'])
def get_role(id):
    return role_schema.jsonify(Role.query.get(id))


@api.route('/roles', methods=['POST'])
@api.route('/roles/<int:id>', methods=['POST'])
@validate_json
#@validate_schema('role_schema')
def create_role(id):
    scheme = role_schema.load(request.get_json(), partial=True)
    res = scheme.data
    if res.name is None:
        return jsonify({}), 400
    if res.id is 0:
        res.id = None
    db.session.add(res)
    db.session.commit()
    return role_schema.jsonify(res)


@api.route('/roles/<int:id>', methods=['PUT'])
@validate_json
def update_role(id):
    role = Role.query.get(id)
    if role is None:
        return jsonify({}), 404
    scheme = role_schema.load(request.get_json(), partial=True)  
    role.authorities = scheme.data.authorities
    #role.authorities = authorities_schema.load(scheme.data.authorities, partial=True)
    db.session.add(role)
    db.session.commit()
    return role_schema.jsonify(role)


@api.route('/roles/<int:id>', methods=['DELETE'])
def delete_role(id):
    role = Role.query.get(id)
    role.authorities[:] = []
    db.session.delete(role)
    db.session.commit()
    return jsonify({}), 200


