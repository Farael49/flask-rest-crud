from flask import jsonify, request

from . import api
from .. import db
from ..models.user import Authority
from ..schemas.authority import authority_schema, authorities_schema
from ..validator import validate_json, validate_schema
from ..util import copy_not_null
from flask_login import login_required, current_user

@api.route('/authority', methods=['GET'])
@login_required
def get_authorities():
    return authorities_schema.dumps(Authority.query.all()) 


@api.route('/authority/<int:id>', methods=['GET'])
@login_required
def get_authority(id):
    return authority_schema.jsonify(Authority.query.get(id))


@api.route('/authority', methods=['POST'])
@validate_json
#@validate_schema('authority_schema')
@login_required
def create_authority():
    scheme = authority_schema.load(request.get_json(), partial=True)
    res = scheme.data
    if res.name is None:
        return jsonify({}), 400
    db.session.add(res)
    db.session.commit()
    return authority_schema.jsonify(res)


@api.route('/authority/<int:id>', methods=['PUT'])
@login_required
def update_authority(id):
    authority = Authority.query.get(id)
    scheme = authority_schema.load(request.get_json(), partial=True)  
    authority.name = scheme.data.authority
    authority.description = scheme.data.description
    db.session.add(authority)
    db.session.commit()
    return authority_schema.jsonify(authority)


@api.route('/authority/<int:id>', methods=['DELETE'])
@login_required
def delete_authority(id):
    Authority.query.filter_by(id=id).delete()
    db.session.commit()
    return jsonify({}), 200


