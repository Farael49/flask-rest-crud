# flask-rest-crud
Basic REST CRUD using Flask  

Requirements : 
Either 
- Vagrant (```vagrant up``` at the root of the project)
or
- Python and pip (and ```pip install requirements.txt``` )
- A database up and running 
- Setting up the file config.py (you may need to install a specific driver depending on the DB. For MySQL, pymysql is already available in the requirements.txt )

running : 
```
export PROJECT_CONFIG=development

python manage.py create_db

python manage.py runserver 

on vagrant : 
python3 manage.py runserver -h 0.0.0.0 
```
