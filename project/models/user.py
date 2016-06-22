class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String, unique=True, nullable=False)
	firstname = db.Column(db.String)
	lastname = db.Column(db.String)
	email = db.Column(db.String, unique=True, nullable=False)
	password = db.Column(db.String)
	created_date = db.Column(db.Date)
	enabled = db.Column(db.Boolean, nullable=False)
	
	def __init__(self, username, email, created_date):
		self.name = name
		self.created_date = datetime.datetime.strptime(created_date, "%d%m%Y").date()
		self.focus = focus


