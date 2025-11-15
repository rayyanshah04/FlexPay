#!/usr/bin/env python3
"""
Migration script to add auth_token column to users table
"""

import os
import sqlite3

def migrate():
    """Add auth_token column to users table"""
    print("Adding auth_token column to users table...")
    
    # Database path
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'database.db')
    
    if not os.path.exists(db_path):
        print(f"✗ Error: Database not found at {db_path}")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if column already exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [row[1] for row in cursor.fetchall()]
        
        if 'auth_token' in columns:
            print("✓ Column 'auth_token' already exists in users table")
            conn.close()
            return
        
        # Add auth_token column
        cursor.execute("ALTER TABLE users ADD COLUMN auth_token TEXT")
        conn.commit()
        
        print("✓ Column 'auth_token' added successfully to users table")
        
        # Verify
        cursor.execute("PRAGMA table_info(users)")
        print("\nUpdated table schema:")
        for row in cursor.fetchall():
            print(f"  {row[1]} ({row[2]})")
        
        conn.close()
        
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == '__main__':
    migrate()
