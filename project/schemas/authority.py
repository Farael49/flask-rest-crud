from .. import ma
from ..models.user import Authority

class AuthoritySchema(ma.ModelSchema):
    class Meta:
        model = Authority

authority_schema = AuthoritySchema()
authorities_schema = AuthoritySchema(many=True)
