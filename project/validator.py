from functools import wraps
from flask import (
    current_app,
    jsonify,
    request,
)

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
