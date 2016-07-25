from .. import ma
from marshmallow import fields
from ..models.user import Authority

class AuthoritySchema(ma.ModelSchema):
    class Meta:
    	model = Authority
    	fields = ('id','name','description')

authority_schema = AuthoritySchema()
authorities_schema = AuthoritySchema(many=True)
