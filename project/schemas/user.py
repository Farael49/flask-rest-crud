from .. import ma
from ..models.user import User


class UserSchema(ma.ModelSchema):

    class Meta:
        model = User


user_schema = UserSchema()
users_schema = UserSchema(many=True)
