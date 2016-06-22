from .. import db


class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    firstname = db.Column(db.String)
    lastname = db.Column(db.String)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String)
    created_date = db.Column(db.Date)
    enabled = db.Column(db.Boolean, nullable=False)
    # Additional fields
    
    def __repr__(self):
        return 'User {}>'.format(self.id)
