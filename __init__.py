from flask import Flask, jsonify, abort, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)


##################
### blueprints ###
##################

from user import 




@app.route("/")
def hello():
    return "Hello World!"

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

@app.route('/dev/', methods = ['GET'])
def index():
	return jsonify({'developers': Developer.query.all()})

@app.route('/dev/', methods = ['POST'])
def create_dev():
    if not request.json or not 'name' in request.json:
        abort(400)
    dev = Developer(request.json.name, request.json.get('hireDate', ''), request.json.get('focus',''))
    db.session.add(dev)
    db.session.commit()
    return jsonify( { 'developer': dev } ), 201

if __name__ == '__main__':
    app.run()
