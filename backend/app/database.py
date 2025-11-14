import os
from cs50 import SQL
from .config import DATABASE_URI

# Ensure the instance directory exists
db_path = DATABASE_URI.replace('sqlite:///', '')
db_dir = os.path.dirname(db_path)
if not os.path.exists(db_dir):
    os.makedirs(db_dir)

# The CS50 library requires the file to exist before connecting.
# Create an empty file if it doesn't exist.
if not os.path.exists(db_path):
    open(db_path, 'a').close()

db = SQL(DATABASE_URI)
