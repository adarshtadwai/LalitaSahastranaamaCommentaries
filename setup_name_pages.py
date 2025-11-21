#!/usr/bin/env python3
"""
Create proper index.html files for each name directory
Each directory will have its own index.html that loads that specific name
"""

from pathlib import Path
import shutil

base_dir = Path(__file__).parent
name_dir = base_dir / 'name'
template_file = name_dir / 'index.html'

# Read the template
with open(template_file, 'r', encoding='utf-8') as f:
    template_content = f.read()

# Create index.html for each numbered directory
for i in range(1, 1001):
    num_dir = name_dir / str(i)
    num_dir.mkdir(exist_ok=True)

    # Copy the template to this directory
    target_file = num_dir / 'index.html'
    shutil.copy(template_file, target_file)

print("Created 1000 name pages successfully!")
