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
user_schema_secure = UserSchema(exclude=["password"])
users_schema_secure = UserSchema(many=True, exclude=["password"])