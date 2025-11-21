#!/usr/bin/env python3
"""
Scrape Telugu meanings from Telugu Wikipedia
"""

import re
import json
import subprocess
from pathlib import Path

# Telugu Wikipedia URLs for all ranges
urls = [
    "https://te.wikipedia.org/wiki/లలితా_సహస్ర_నామములు-_1-100",
    "https://te.wikipedia.org/wiki/లలితా_సహస్ర_నామములు-_101-200",
    "https://te.wikipedia.org/wiki/లలితా_సహస్ర_నామములు-_201-300",
    "https://te.wikipedia.org/wiki/లలితా_సహస్ర_నామములు-_301-400",
    "https://te.wikipedia.org/wiki/లలితా_సహస్ర_నామములు-_401-500",
    "https://te.wikipedia.org/wiki/లలితా_సహస్ర_నామములు-_501-600",
    "https://te.wikipedia.org/wiki/లలితా_సహస్ర_నామములు-_601-700",
    "https://te.wikipedia.org/wiki/లలితా_సహస్ర_నామములు-_701-800",
    "https://te.wikipedia.org/wiki/లలితా_సహస్ర_నామములు-_801-900",
    "https://te.wikipedia.org/wiki/లలితా_సహస్ర_నామములు-_901-1000",
]

telugu_meanings = {}
current_number = 1

for url in urls:
    print(f"Fetching {url}...")

    # Download using curl
    result = subprocess.run(
        ['curl', '-s', url, '-H', 'User-Agent: Mozilla/5.0'],
        capture_output=True,
        text=True
    )

    html_content = result.stdout

    # Pattern to match: <li> నామం&#160;: అర్థం (with possible HTML tags in between)
    # The names are in Telugu script
    pattern = r'<li>\s*([^\s:]+)&#160;:\s*(.+?)\s*(?:</li>|<li>)'

    for match in re.finditer(pattern, html_content, re.DOTALL):
        name_telugu = match.group(1).strip()
        meaning_html = match.group(2).strip()

        # Remove HTML tags from meaning
        meaning_telugu = re.sub(r'<[^>]+>', '', meaning_html)
        # Clean up HTML entities
        meaning_telugu = meaning_telugu.replace('&#160;', ' ')
        # Remove extra whitespace
        meaning_telugu = ' '.join(meaning_telugu.split())
        # Remove trailing period
        meaning_telugu = meaning_telugu.rstrip('.')

        if name_telugu and meaning_telugu:
            telugu_meanings[current_number] = {
                'name': name_telugu,
                'meaning': meaning_telugu
            }
            current_number += 1

print(f"\nExtracted {len(telugu_meanings)} Telugu meanings")

# Save to JSON
output_file = Path(__file__).parent / 'telugu_meanings.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(telugu_meanings, f, ensure_ascii=False, indent=2)

print(f"Saved to {output_file}")

# Show first few and last few
for i in [1, 2, 3, 998, 999, 1000]:
    if i in telugu_meanings:
        print(f"{i}. {telugu_meanings[i]['name']}: {telugu_meanings[i]['meaning'][:60]}...")
