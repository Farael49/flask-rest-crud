from flask import (
    Flask, 
    render_template,
    send_from_directory,
    jsonify,
    redirect
)
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from config import config
from flask_login import LoginManager
from flasgger import Swagger

class CustomFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        block_start_string='<%',
        block_end_string='%>',
        variable_start_string='%%',
        variable_end_string='%%',
        comment_start_string='<#',
        comment_end_string='#>',
    ))

db = SQLAlchemy()
app = CustomFlask(__name__)
ma = Marshmallow(app)
login_manager = LoginManager()
login_manager.init_app(app)
bcrypt = Bcrypt(app)

app.config['SWAGGER'] = {
    "specs": [
        {
            "version":"1",
            "title":"Api v1",
            "endpoint": "v1_spec",
            "route":"/v1/spec/"
        }
    ]
}
Swagger(app)

def create_app(config_name):
    app.config.from_object(config[config_name])
    db.init_app(app)
    ma.init_app(app)
    from .api_v1 import api as api_v1_blueprint
    app.register_blueprint(api_v1_blueprint, url_prefix='/api/v1')
    return app

@app.route('/', methods=['GET'])
def index():
    return redirect("/apidocs/index.html")



'''
@app.route('/<path:path>')
def send_templates(path):
    return send_from_directory('templates', path)

@app.route('/static/<path:path>')
def send_statics(path):
    return send_from_directory('templates', path)
'''
