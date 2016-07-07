from .. import ma
from ..models.user import Role

class RoleSchema(ma.ModelSchema):
    class Meta:
        model = Role

role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)
