#!/usr/bin/env python3
"""
Extract meanings from the downloaded HTML
"""

import re
import json
from pathlib import Path

# Read the downloaded HTML
with open('/tmp/lalita1000.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Pattern to match the format:
# १. श्रीमाता -
# She who is the auspicious Mother
pattern = r'([०-९]+)\.\s*([\u0900-\u097F]+)\s*-\s*\n([^\n]+(?:\n\s+[^\n]+)*?)(?=\n[०-९]+\.|$)'

meanings = {}
for match in re.finditer(pattern, html_content, re.MULTILINE):
    # Convert Devanagari number to Arabic
    dev_number = match.group(1)
    number = 0
    dev_to_arabic = {'०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
                     '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'}
    for char in dev_number:
        number = number * 10 + int(dev_to_arabic[char])

    name = match.group(2).strip()
    meaning = match.group(3).strip()
    # Clean up multi-line meanings
    meaning = ' '.join(meaning.split())

    meanings[number] = {
        'name': name,
        'meaning': meaning
    }

print(f"Extracted {len(meanings)} meanings")

# Save to JSON
output_file = Path(__file__).parent / 'sanskrit_documents_meanings.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(meanings, f, ensure_ascii=False, indent=2)

print(f"Saved to {output_file}")

# Show first and last few
for i in [1, 2, 3, 998, 999, 1000]:
    if i in meanings:
        print(f"{i}. {meanings[i]['name']}: {meanings[i]['meaning'][:80]}...")
