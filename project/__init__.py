from flask import Flask, jsonify, abort, request
from flask_sqlalchemy import SQLAlchemy
from .api.v1 import api as api_v1

app = Flask(__name__)
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)


##################
### blueprints ###
##################


app.register_blueprint(api_v1, url_prefix='/api/v1')

@app.route("/")
def hello():
    return "Hello World!"


if __name__ == '__main__':
    app.run()
