#!/usr/bin/env python3
"""
Add Telugu meanings to the consolidated JSON
"""

import json
from pathlib import Path

base_dir = Path(__file__).parent

# Load Telugu meanings
with open(base_dir / 'telugu_meanings.json', 'r', encoding='utf-8') as f:
    telugu_data = json.load(f)

# Load consolidated JSON
with open(base_dir / 'all-names.json', 'r', encoding='utf-8') as f:
    all_names_data = json.load(f)

updated_count = 0

for name_entry in all_names_data['names']:
    number = name_entry['number']

    # Add Telugu meaning field if it exists
    if str(number) in telugu_data:
        name_entry['meaning_telugu'] = telugu_data[str(number)]['meaning']
        updated_count += 1
    else:
        name_entry['meaning_telugu'] = ''

print(f"Added {updated_count} Telugu meanings")

# Save updated JSON
with open(base_dir / 'all-names.json', 'w', encoding='utf-8') as f:
    json.dump(all_names_data, f, ensure_ascii=False, indent=2)

print(f"Updated all-names.json")

# Show some examples
for i in [1, 2, 3]:
    entry = all_names_data['names'][i-1]
    print(f"\n{i}. {entry['name']}")
    if entry.get('meaning_telugu'):
        print(f"   Telugu: {entry['meaning_telugu'][:70]}...")
    print(f"   English: {entry['datta_commentary']['meaning'][:70]}...")
