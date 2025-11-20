#!/usr/bin/env python3
"""
Migration script to add login_pin column to users table
"""

import os
import sqlite3

def migrate():
    """Add login_pin column to users table"""
    print("Adding login_pin column to users table...")
    
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
        
        if 'login_pin' in columns:
            print("✓ Column 'login_pin' already exists in users table")
            conn.close()
            return
        
        # Add login_pin column
        cursor.execute("ALTER TABLE users ADD COLUMN login_pin TEXT")
        conn.commit()
        
        print("✓ Column 'login_pin' added successfully to users table")
        
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
