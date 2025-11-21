#!/usr/bin/env python3
"""
Generate redirect HTML pages for clean URLs
"""

from pathlib import Path

# Create redirect HTML template
redirect_template = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script>
        window.location.href = 'index.html#{number}';
    </script>
</head>
<body>
    <p>Redirecting to name {number}...</p>
</body>
</html>
"""

# Create name directory subdirectories with index.html
name_dir = Path(__file__).parent / 'name'

for i in range(1, 1001):
    # Create directory for this number
    num_dir = name_dir / str(i)
    num_dir.mkdir(exist_ok=True)

    # Create index.html that redirects
    index_file = num_dir / 'index.html'
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(redirect_template.format(number=i))

print(f"Created {1000} redirect pages in Code/name/")
