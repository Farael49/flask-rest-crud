#! /usr/bin/env python

import os

from flask_script import Manager

from project import create_app, db


app = create_app(os.getenv('PROJECT_CONFIG', 'default'))
manager = Manager(app)

@manager.shell
def make_shell_context():
    return dict(app=app, db=db)


@manager.command
def create_db():
    '''Creates the db tables.'''
    db.create_all()

@manager.command
def drop_db():
    """Drops the db tables."""
    db.drop_all()
    
if __name__ == '__main__':
    manager.run()
