from .. import ma
from marshmallow import fields
from ..models.user import Role

class RoleSchema(ma.ModelSchema):
	class Meta:
		model = Role
		fields = ('id', 'name', 'description', 'authorities')
	authorities = fields.Nested('AuthoritySchema', many=True)

role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)
