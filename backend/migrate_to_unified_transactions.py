"""
Database Migration Script: Unified Transactions Table

This script consolidates the 'transactions' and 'coupon_redemptions' tables
into a single unified 'transactions' table with a transaction_type field.

For coupon redemptions, sender_id stores the coupon ID (source of money).

Run this script to migrate your database:
    python migrate_to_unified_transactions.py
"""

import os
import sqlite3
from datetime import datetime

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), 'instance', 'database.db')

def migrate_database():
    """Migrate to unified transactions table"""
    
    print("=" * 60)
    print("FlexPay Database Migration: Unified Transactions Table")
    print("=" * 60)
    print(f"Database: {DB_PATH}")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    if not os.path.exists(DB_PATH):
        print(f"ERROR: Database not found at {DB_PATH}")
        return False
    
    # Create backup
    backup_path = DB_PATH + f".backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    print(f"Creating backup at: {backup_path}")
    
    try:
        import shutil
        shutil.copy2(DB_PATH, backup_path)
        print("[OK] Backup created successfully")
        print()
    except Exception as e:
        print(f"ERROR: Failed to create backup: {e}")
        return False
    
    # Connect to database
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    try:
        # Step 1: Check existing tables
        print("Step 1: Checking existing tables...")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        print(f"  Found tables: {', '.join(tables)}")
        
        has_transactions = 'transactions' in tables
        has_coupon_redemptions = 'coupon_redemptions' in tables
        
        if not has_transactions:
            print("  WARNING: 'transactions' table not found")
        if not has_coupon_redemptions:
            print("  WARNING: 'coupon_redemptions' table not found")
        print()
        
        # Step 2: Create new unified transactions table
        print("Step 2: Creating new unified transactions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS transactions_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_type TEXT NOT NULL,
                sender_id INTEGER NOT NULL,
                receiver_id INTEGER NOT NULL,
                amount REAL NOT NULL,
                status TEXT DEFAULT 'completed',
                note TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (receiver_id) REFERENCES users(id)
            )
        """)
        print("[OK] Created 'transactions_new' table")
        print("  Note: sender_id stores user_id for transfers, coupon_id for redemptions")
        print()
        
        # Step 3: Migrate existing transactions (peer-to-peer transfers)
        if has_transactions:
            print("Step 3: Migrating existing peer-to-peer transactions...")
            cursor.execute("SELECT COUNT(*) FROM transactions")
            old_count = cursor.fetchone()[0]
            print(f"  Found {old_count} existing transactions")
            
            cursor.execute("""
                INSERT INTO transactions_new 
                    (id, transaction_type, sender_id, receiver_id, amount, status, timestamp)
                SELECT 
                    id, 
                    'transfer' as transaction_type,
                    sender_id, 
                    receiver_id, 
                    amount, 
                    status,
                    timestamp
                FROM transactions
            """)
            print(f"[OK] Migrated {old_count} peer-to-peer transactions")
            print()
        else:
            print("Step 3: Skipped (no existing transactions table)")
            print()
        
        # Step 4: Migrate coupon redemptions
        if has_coupon_redemptions:
            print("Step 4: Migrating coupon redemptions...")
            cursor.execute("SELECT COUNT(*) FROM coupon_redemptions")
            redemption_count = cursor.fetchone()[0]
            print(f"  Found {redemption_count} coupon redemptions")
            
            # sender_id = coupon_id for redemptions
            cursor.execute("""
                INSERT INTO transactions_new 
                    (transaction_type, sender_id, receiver_id, amount, status, note, timestamp)
                SELECT 
                    'coupon_redemption' as transaction_type,
                    cr.coupon_id as sender_id,
                    cr.user_id as receiver_id,
                    cr.amount,
                    'completed' as status,
                    c.coupon_code as note,
                    cr.redeemed_at as timestamp
                FROM coupon_redemptions cr
                JOIN coupons c ON cr.coupon_id = c.id
            """)
            print(f"[OK] Migrated {redemption_count} coupon redemptions")
            print("  Note: sender_id contains coupon_id for these transactions")
            print()
        else:
            print("Step 4: Skipped (no existing coupon_redemptions table)")
            print()
        
        # Step 5: Verify migration
        print("Step 5: Verifying migration...")
        cursor.execute("SELECT COUNT(*) FROM transactions_new")
        new_total = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM transactions_new WHERE transaction_type = 'transfer'")
        transfer_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM transactions_new WHERE transaction_type = 'coupon_redemption'")
        redemption_count_new = cursor.fetchone()[0]
        
        print(f"  Total transactions in new table: {new_total}")
        print(f"    - Transfers: {transfer_count}")
        print(f"    - Coupon redemptions: {redemption_count_new}")
        print()
        
        # Step 6: Drop old tables and rename new one
        print("Step 6: Replacing old tables with new unified table...")
        
        if has_transactions:
            cursor.execute("DROP TABLE transactions")
            print("[OK] Dropped old 'transactions' table")
        
        if has_coupon_redemptions:
            cursor.execute("DROP TABLE coupon_redemptions")
            print("[OK] Dropped 'coupon_redemptions' table")
        
        cursor.execute("ALTER TABLE transactions_new RENAME TO transactions")
        print("[OK] Renamed 'transactions_new' to 'transactions'")
        print()
        
        # Commit changes
        conn.commit()
        
        print("=" * 60)
        print("[SUCCESS] Migration completed successfully!")
        print("=" * 60)
        print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Backup saved at: {backup_path}")
        print()
        
        return True
        
    except Exception as e:
        print()
        print("=" * 60)
        print("ERROR: Migration failed!")
        print("=" * 60)
        print(f"Error: {e}")
        print(f"\nRestoring from backup: {backup_path}")
        conn.rollback()
        conn.close()
        
        # Restore backup
        try:
            import shutil
            shutil.copy2(backup_path, DB_PATH)
            print("[OK] Database restored from backup")
        except Exception as restore_error:
            print(f"ERROR: Failed to restore backup: {restore_error}")
        
        return False
        
    finally:
        conn.close()

if __name__ == "__main__":
    success = migrate_database()
    exit(0 if success else 1)
