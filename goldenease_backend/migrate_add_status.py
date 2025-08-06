#!/usr/bin/env python3
"""
Database migration script to add 'status' column to users table
"""

import sqlite3
import os

def add_status_column():
    # Path to the database file
    db_path = "docverifier.db"
    
    if not os.path.exists(db_path):
        print(f"Database file not found at {db_path}")
        print("Please make sure the database exists before running this migration.")
        return False
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if status column already exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'status' in columns:
            print("Status column already exists in users table.")
            conn.close()
            return True
        
        # Add the status column with default value 'pending'
        cursor.execute("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'pending'")
        
        # Update existing users to have 'pending' status
        cursor.execute("UPDATE users SET status = 'pending' WHERE status IS NULL")
        
        # Commit the changes
        conn.commit()
        conn.close()
        
        print("Successfully added 'status' column to users table.")
        print("All existing users have been set to 'pending' status.")
        return True
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("Adding 'status' column to users table...")
    success = add_status_column()
    if success:
        print("Migration completed successfully!")
    else:
        print("Migration failed!")
