#!/usr/bin/env python3
"""
Database initialization script for FlexPay
Run this to set up the database schema
"""

import sqlite3
import os

def init_db():
    """Initialize the database with the schema"""
    print("Initializing FlexPay database...")
    
    # Database path
    db_path = os.path.join(os.path.dirname(__file__), 'app', 'database.db')
    
    # Read schema file
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    with open(schema_path, 'r') as f:
        schema = f.read()
    
    # Connect and execute
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Execute the entire schema
        cursor.executescript(schema)
        conn.commit()
        print("✓ Database schema created successfully!")
        
        # Verify tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print("\nCreated tables:")
        for table in tables:
            print(f"  - {table[0]}")
            
    except Exception as e:
        print(f"✗ Error: {e}")
        conn.rollback()
    finally:
        conn.close()
    
    print("\n✓ Database initialized successfully!")
    print("You can now run the Flask application with: python Run")

if __name__ == '__main__':
    init_db()
