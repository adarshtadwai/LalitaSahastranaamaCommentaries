#!/usr/bin/env python3
"""
Scrape meanings from sanskritdocuments.org
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from pathlib import Path

url = "https://sanskritdocuments.org/doc_devii/lalita1000.html"

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
}

print(f"Fetching {url}...")
response = requests.get(url, headers=headers)
response.raise_for_status()

soup = BeautifulSoup(response.content, 'html.parser')

# Find all text content
text = soup.get_text()

# Pattern to match: number. name (transliteration): "meaning"
# Example: 1. श्रीमाता (Shri Mata): "She who is the auspicious Mother"
pattern = r'(\d+)\.\s*([\u0900-\u097F]+)\s*\(([^)]+)\):\s*"([^"]+)"'

meanings = {}
for match in re.finditer(pattern, text):
    number = int(match.group(1))
    devanagari = match.group(2).strip()
    transliteration = match.group(3).strip()
    meaning = match.group(4).strip()

    meanings[number] = {
        'devanagari': devanagari,
        'transliteration': transliteration,
        'meaning': meaning
    }

print(f"Extracted {len(meanings)} meanings")

# Save to JSON
output_file = Path(__file__).parent / 'sanskrit_documents_meanings.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(meanings, f, ensure_ascii=False, indent=2)

print(f"Saved to {output_file}")

# Show first few
for i in range(1, min(6, len(meanings) + 1)):
    if i in meanings:
        print(f"{i}. {meanings[i]['devanagari']}: {meanings[i]['meaning']}")
