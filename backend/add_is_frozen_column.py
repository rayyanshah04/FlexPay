#!/usr/bin/env python3
"""
Migration script to add is_frozen column to cards table
"""

import os
import sqlite3

def migrate():
    """Add is_frozen column to cards table"""
    print("Adding is_frozen column to cards table...")
    
    # Database path
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'database.db')
    
    if not os.path.exists(db_path):
        print(f"✗ Error: Database not found at {db_path}")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if column already exists
        cursor.execute("PRAGMA table_info(cards)")
        columns = [row[1] for row in cursor.fetchall()]
        
        if 'is_frozen' in columns:
            print("✓ Column 'is_frozen' already exists in cards table")
            conn.close()
            return
        
        # Add is_frozen column with default value 0 (not frozen)
        cursor.execute("ALTER TABLE cards ADD COLUMN is_frozen INTEGER DEFAULT 0")
        conn.commit()
        
        print("✓ Column 'is_frozen' added successfully to cards table")
        
        # Verify
        cursor.execute("PRAGMA table_info(cards)")
        print("\nUpdated table schema:")
        for row in cursor.fetchall():
            print(f"  {row[1]} ({row[2]})")
        
        conn.close()
        
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == '__main__':
    migrate()
