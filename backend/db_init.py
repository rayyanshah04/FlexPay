#!/usr/bin/env python
import os
from cs50 import SQL

def initialize_database():
    """
    Initializes the database by deleting the old one and creating tables from the schema.sql file.
    """
    from app.config import DATABASE_URI

    # Extract the database file path from the URI
    db_path = DATABASE_URI.replace('sqlite:///', '')
    db_dir = os.path.dirname(db_path)

    # Ensure the instance directory exists
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)

    # Delete the old database file if it exists
    if os.path.exists(db_path):
        os.remove(db_path)
        print("Old database deleted.")

    # Create a new empty database file for the SQL object to connect to
    open(db_path, 'a').close()
    
    # Create a new SQL object for initialization
    db = SQL(DATABASE_URI)

    # Path to the schema file
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')

    if not os.path.exists(schema_path):
        print(f"Error: Schema file not found at {schema_path}")
        return

    with open(schema_path, 'r') as f:
        schema = f.read()

    statements = [s.strip() for s in schema.split(';') if s.strip()]

    try:
        for statement in statements:
            db.execute(statement)
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")

if __name__ == "__main__":
    # Confirm with the user before proceeding
    print("This script will initialize the database.")
    print("WARNING: This may delete existing data if tables are recreated.")
    choice = input("Are you sure you want to continue? (y/n): ")

    if choice.lower() == 'y':
        initialize_database()
    else:
        print("Database initialization cancelled.")
