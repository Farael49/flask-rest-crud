from functools import wraps
from flask import (
    current_app,
    jsonify,
    request,
)
from flask_login import current_user

def validate_json(f):
    @wraps(f)
    def wrapper(*args, **kw):
        try:
            request.json
        except BadRequest as e:
            msg = "payload must be a valid json"
            return jsonify({"error": msg}), 400
        return f(*args, **kw)
    return wrapper


def validate_schema(schema_name):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kw):
            try:
                validate(request.json, current_app.config[schema_name])
            except Exception as e:
                return jsonify({"error": e}), 400
            return f(*args, **kw)
        return wrapper
    return decorator


def requires_roles(*roles):
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if not current_user.is_authenticated:
                return jsonify({"error":"Unauthorized"}), 401
            if (set(r.lower() for r in get_current_user_roles()).intersection(set(x.lower() for x in roles))):
                return f(*args, **kwargs)
            return jsonify({"error":"Forbidden"}), 403
        return wrapped
    return wrapper

def get_current_user_roles():
    if current_user.is_authenticated:
        return [r.name for r in current_user.roles]            
    return None
