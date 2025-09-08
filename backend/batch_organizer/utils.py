import os
import shutil
import zipfile
import rarfile
import tarfile
import mimetypes
import re
from datetime import datetime, timedelta
from pathlib import Path
import magic
from django.core.files.storage import default_storage
from django.utils import timezone


class BatchFileOrganizer:
    """Main class for batch file organization operations."""
    
    def __init__(self):
        self.supported_archives = ['.zip', '.rar', '.tar', '.tar.gz', '.7z']
        self.image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp']
        self.document_extensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt']
        self.video_extensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv']
        self.audio_extensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a']
    
    def organize_by_type(self, source_path, target_path):
        """Organize files by their type/extension."""
        operations = []
        
        for root, dirs, files in os.walk(source_path):
            for file in files:
                file_path = os.path.join(root, file)
                file_ext = Path(file).suffix.lower()
                
                # Determine target folder based on file type
                if file_ext in self.image_extensions:
                    target_folder = os.path.join(target_path, 'Images')
                elif file_ext in self.document_extensions:
                    target_folder = os.path.join(target_path, 'Documents')
                elif file_ext in self.video_extensions:
                    target_folder = os.path.join(target_path, 'Videos')
                elif file_ext in self.audio_extensions:
                    target_folder = os.path.join(target_path, 'Audio')
                elif file_ext in self.supported_archives:
                    target_folder = os.path.join(target_path, 'Archives')
                else:
                    target_folder = os.path.join(target_path, 'Others')
                
                # Create target directory if it doesn't exist
                os.makedirs(target_folder, exist_ok=True)
                
                # Generate unique filename if file already exists
                target_file_path = os.path.join(target_folder, file)
                target_file_path = self._get_unique_filename(target_file_path)
                
                operations.append({
                    'source': file_path,
                    'target': target_file_path,
                    'operation': 'move'
                })
        
        return operations
    
    def organize_by_date(self, source_path, target_path, date_format='%Y/%m'):
        """Organize files by creation or modification date."""
        operations = []
        
        for root, dirs, files in os.walk(source_path):
            for file in files:
                file_path = os.path.join(root, file)
                
                # Get file modification time
                mod_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                date_folder = mod_time.strftime(date_format)
                
                target_folder = os.path.join(target_path, date_folder)
                os.makedirs(target_folder, exist_ok=True)
                
                target_file_path = os.path.join(target_folder, file)
                target_file_path = self._get_unique_filename(target_file_path)
                
                operations.append({
                    'source': file_path,
                    'target': target_file_path,
                    'operation': 'move'
                })
        
        return operations
    
    def organize_by_size(self, source_path, target_path):
        """Organize files by their size."""
        operations = []
        size_categories = {
            'Small': (0, 1024 * 1024),  # 0-1MB
            'Medium': (1024 * 1024, 50 * 1024 * 1024),  # 1-50MB
            'Large': (50 * 1024 * 1024, 500 * 1024 * 1024),  # 50-500MB
            'XLarge': (500 * 1024 * 1024, float('inf'))  # 500MB+
        }
        
        for root, dirs, files in os.walk(source_path):
            for file in files:
                file_path = os.path.join(root, file)
                file_size = os.path.getsize(file_path)
                
                # Determine size category
                size_category = 'Unknown'
                for category, (min_size, max_size) in size_categories.items():
                    if min_size <= file_size < max_size:
                        size_category = category
                        break
                
                target_folder = os.path.join(target_path, size_category)
                os.makedirs(target_folder, exist_ok=True)
                
                target_file_path = os.path.join(target_folder, file)
                target_file_path = self._get_unique_filename(target_file_path)
                
                operations.append({
                    'source': file_path,
                    'target': target_file_path,
                    'operation': 'move'
                })
        
        return operations
    
    def organize_by_pattern(self, source_path, target_path, patterns):
        """Organize files based on name patterns."""
        operations = []
        
        for root, dirs, files in os.walk(source_path):
            for file in files:
                file_path = os.path.join(root, file)
                
                # Check each pattern
                matched_folder = 'Uncategorized'
                for pattern_name, pattern_regex in patterns.items():
                    if re.match(pattern_regex, file, re.IGNORECASE):
                        matched_folder = pattern_name
                        break
                
                target_folder = os.path.join(target_path, matched_folder)
                os.makedirs(target_folder, exist_ok=True)
                
                target_file_path = os.path.join(target_folder, file)
                target_file_path = self._get_unique_filename(target_file_path)
                
                operations.append({
                    'source': file_path,
                    'target': target_file_path,
                    'operation': 'move'
                })
        
        return operations
    
    def batch_rename(self, source_path, rename_pattern):
        """Batch rename files based on a pattern."""
        operations = []
        counter = 1
        
        for root, dirs, files in os.walk(source_path):
            for file in files:
                file_path = os.path.join(root, file)
                file_ext = Path(file).suffix
                
                # Generate new name based on pattern
                new_name = rename_pattern.replace('{counter}', str(counter).zfill(3))
                new_name = new_name.replace('{date}', datetime.now().strftime('%Y%m%d'))
                new_name = new_name.replace('{original}', Path(file).stem)
                new_name += file_ext
                
                new_file_path = os.path.join(root, new_name)
                new_file_path = self._get_unique_filename(new_file_path)
                
                operations.append({
                    'source': file_path,
                    'target': new_file_path,
                    'operation': 'rename'
                })
                
                counter += 1
        
        return operations
    
    def extract_archives(self, source_path, target_path):
        """Extract all archive files in the source path."""
        operations = []
        
        for root, dirs, files in os.walk(source_path):
            for file in files:
                file_path = os.path.join(root, file)
                file_ext = Path(file).suffix.lower()
                
                if file_ext in self.supported_archives:
                    # Create extraction folder
                    extract_folder = os.path.join(target_path, Path(file).stem)
                    os.makedirs(extract_folder, exist_ok=True)
                    
                    operations.append({
                        'source': file_path,
                        'target': extract_folder,
                        'operation': 'extract'
                    })
        
        return operations
    
    def _get_unique_filename(self, filepath):
        """Generate a unique filename if the file already exists."""
        if not os.path.exists(filepath):
            return filepath
        
        base_path = Path(filepath)
        directory = base_path.parent
        name = base_path.stem
        extension = base_path.suffix
        
        counter = 1
        while True:
            new_name = f"{name}_{counter}{extension}"
            new_path = directory / new_name
            if not os.path.exists(new_path):
                return str(new_path)
            counter += 1
    
    def get_file_info(self, file_path):
        """Get detailed information about a file."""
        stat = os.stat(file_path)
        
        return {
            'name': os.path.basename(file_path),
            'size': stat.st_size,
            'extension': Path(file_path).suffix.lower(),
            'mime_type': mimetypes.guess_type(file_path)[0] or 'unknown',
            'created': datetime.fromtimestamp(stat.st_ctime),
            'modified': datetime.fromtimestamp(stat.st_mtime),
            'path': file_path
        }


class DuplicateFinder:
    """Find and handle duplicate files."""
    
    def __init__(self):
        self.hash_cache = {}
    
    def find_duplicates(self, paths):
        """Find duplicate files in the given paths."""
        file_hashes = {}
        duplicates = []
        
        for path in paths:
            for root, dirs, files in os.walk(path):
                for file in files:
                    file_path = os.path.join(root, file)
                    file_hash = self._get_file_hash(file_path)
                    
                    if file_hash in file_hashes:
                        duplicates.append({
                            'original': file_hashes[file_hash],
                            'duplicate': file_path,
                            'hash': file_hash
                        })
                    else:
                        file_hashes[file_hash] = file_path
        
        return duplicates
    
    def _get_file_hash(self, file_path):
        """Calculate MD5 hash of a file."""
        import hashlib
        
        if file_path in self.hash_cache:
            return self.hash_cache[file_path]
        
        hash_md5 = hashlib.md5()
        try:
            with open(file_path, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_md5.update(chunk)
            
            file_hash = hash_md5.hexdigest()
            self.hash_cache[file_path] = file_hash
            return file_hash
        except (IOError, OSError):
            return None


def create_default_organization_rules():
    """Create default organization rules for common scenarios."""
    from .models import OrganizationRule, OrganizationPreset
    
    # Media Files Rule
    media_rule = OrganizationRule.objects.create(
        name="Media Files by Type",
        description="Organize images, videos, and audio by type",
        rule_type="extension",
        rule_criteria={
            "extensions": {
                "Images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"],
                "Videos": [".mp4", ".avi", ".mkv", ".mov", ".wmv"],
                "Audio": [".mp3", ".wav", ".flac", ".aac", ".ogg"]
            }
        },
        target_folder="Media/{type}",
        priority=10
    )
    
    # Documents Rule
    docs_rule = OrganizationRule.objects.create(
        name="Documents by Type",
        description="Organize documents by file type",
        rule_type="extension",
        rule_criteria={
            "extensions": {
                "PDFs": [".pdf"],
                "Word_Documents": [".doc", ".docx"],
                "Spreadsheets": [".xls", ".xlsx", ".csv"],
                "Presentations": [".ppt", ".pptx"]
            }
        },
        target_folder="Documents/{type}",
        priority=9
    )
    
    # Create a default preset
    preset = OrganizationPreset.objects.create(
        name="General File Organization",
        description="Basic organization by file types",
        is_default=True
    )
    preset.rules.add(media_rule, docs_rule)
    
    return [media_rule, docs_rule]
