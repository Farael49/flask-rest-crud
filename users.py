from flask import Flask, jsonify, abort, request
from flask_sqlalchemy import SQLAlchemy

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
