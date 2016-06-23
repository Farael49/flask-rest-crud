from .. import ma
from ..models.user import User


class UserSchema(ma.ModelSchema):
    #id = fields.Integer()
    #username = fields.String()
    #enabled = fields.Boolean()
    class Meta:
        model = User


user_schema = UserSchema()
users_schema = UserSchema(many=True)
