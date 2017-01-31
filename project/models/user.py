from .. import db
from datetime import datetime

roles = db.Table('user_role',
    db.Column('role_id', db.Integer, db.ForeignKey('role.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
)

authorities = db.Table('role_authority',
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'), primary_key=True),
    db.Column('authority_id', db.Integer, db.ForeignKey('authority.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    firstname = db.Column(db.String(80))
    lastname = db.Column(db.String(80))
    password = db.Column(db.String(80))
    created_date = db.Column(db.DateTime, default=datetime.utcnow())
    enabled = db.Column(db.Boolean, default=True)
    roles = db.relationship('Role', secondary=roles, backref=db.backref('users', lazy='dynamic'))
    # Additional fields

    
    def __init__(self, email, password, username=None):
        self.email = email
        self.username = email if username is None else username   
        self.password = password

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    def __repr__(self):
        return 'User {}>'.format(self)

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    description = db.Column(db.String(80))
    authorities = db.relationship('Authority', secondary=authorities, backref=db.backref('roles', lazy='dynamic'))
    def __repr__(self):
        return 'Role {}>'.format(self)

class Authority(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    description = db.Column(db.String(80))
    def __repr__(self):
        return 'Authority {}>'.format(self)
