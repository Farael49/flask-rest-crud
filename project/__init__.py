from flask import (
    Flask, 
    render_template,
)
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

from config import config

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
ma = Marshmallow()
app = CustomFlask(__name__)


def create_app(config_name):
    app.config.from_object(config[config_name])

    db.init_app(app)
    ma.init_app(app)

    from .api_v1 import api as api_v1_blueprint
    app.register_blueprint(api_v1_blueprint, url_prefix='/api/v1')

    return app

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

