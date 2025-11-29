import os
import sys
from werkzeug.security import generate_password_hash

# Add the current directory to the python path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import db

def create_admin_table():
    print("Creating admins table...")
    db.execute("""
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    print("Table created successfully.")

def create_default_admin():
    username = "admin"
    password = "admin123"
    password_hash = generate_password_hash(password)

    print(f"Checking if user '{username}' exists...")
    existing_user = db.execute("SELECT * FROM admins WHERE username = ?", username)

    if not existing_user:
        print(f"Creating default admin user: {username}")
        db.execute("INSERT INTO admins (username, password_hash) VALUES (?, ?)", username, password_hash)
        print("Default admin created.")
    else:
        print(f"User '{username}' already exists.")

if __name__ == "__main__":
    create_admin_table()
    create_default_admin()
