#!/usr/bin/env python
"""
Reset Database Script
This script will reset the database to a clean state for deployment
"""
import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'compress_website.settings')
django.setup()

from django.core.management import execute_from_command_line
from django.core.management.commands.flush import Command as FlushCommand
from django.core.management.commands.migrate import Command as MigrateCommand

def reset_database():
    """Reset database to clean state"""
    print("Resetting database...")
    
    try:
        # Delete all data but keep tables
        print("Flushing database...")
        execute_from_command_line(['manage.py', 'flush', '--noinput'])
        
        # Run migrations to ensure everything is up to date
        print("Running migrations...")
        execute_from_command_line(['manage.py', 'migrate'])
        
        print("Database reset complete!")
        print("Database is now clean and ready for deployment!")
        
    except Exception as e:
        print(f"Error resetting database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    reset_database()
