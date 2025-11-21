#!/usr/bin/env python3
"""
Update consolidated JSON with meanings from sanskritdocuments.org
Fill empty meanings in datta_commentary
"""

import json
from pathlib import Path

base_dir = Path(__file__).parent

# Load sanskrit documents meanings
with open(base_dir / 'sanskrit_documents_meanings.json', 'r', encoding='utf-8') as f:
    sanskrit_meanings = json.load(f)

# Load consolidated JSON
with open(base_dir / 'all-names.json', 'r', encoding='utf-8') as f:
    all_names_data = json.load(f)

updated_count = 0

for name_entry in all_names_data['names']:
    number = name_entry['number']

    # If datta_commentary meaning is empty, fill it from sanskrit documents
    if not name_entry['datta_commentary']['meaning']:
        if str(number) in sanskrit_meanings:
            name_entry['datta_commentary']['meaning'] = sanskrit_meanings[str(number)]['meaning']
            updated_count += 1

print(f"Updated {updated_count} empty meanings with sanskritdocuments.org meanings")

# Save updated JSON
with open(base_dir / 'all-names.json', 'w', encoding='utf-8') as f:
    json.dump(all_names_data, f, ensure_ascii=False, indent=2)

print(f"Updated all-names.json")

# Show some examples
for i in [1, 2, 3, 112, 118]:
    entry = all_names_data['names'][i-1]
    print(f"\n{i}. {entry['name']}")
    print(f"   Meaning: {entry['datta_commentary']['meaning'][:80]}...")
