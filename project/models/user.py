from .. import db

roles = db.Table('user_role',
    db.Column('role_id', db.Integer, db.ForeignKey('role.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
)

authorities = db.Table('role_authority',
    db.Column('role_id', db.Integer, db.ForeignKey('role.id')),
    db.Column('authority_id', db.Integer, db.ForeignKey('authority.id'))
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    firstname = db.Column(db.String)
    lastname = db.Column(db.String)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String)
    created_date = db.Column(db.Date)
    enabled = db.Column(db.Boolean, nullable=False)
    roles = db.relationship('Role', secondary=roles, backref=db.backref('users', lazy='dynamic'))
    # Additional fields
    
    def __repr__(self):
        return 'User {}>'.format(self.id)

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    authorities = db.relationship('Authority', secondary=authorities, backref=db.backref('roles', lazy='dynamic'))

class Authority(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)

