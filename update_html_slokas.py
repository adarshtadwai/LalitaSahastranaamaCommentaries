#!/usr/bin/env python3
"""
Update HTML files to display reformatted sloka text with line breaks.
Reads the sloka from .txt files and updates the corresponding HTML files.
"""

import os
import re
from pathlib import Path

def find_sloka_txt_file(html_path, base_dir):
    """
    Find the corresponding .txt file for an HTML file.

    For Uma Sahasranama:
    - HTML: umasahasranama/shataka-XX/stabaka-YY/ZZ/index.html
    - TXT: umasahasranama/shataka-XX/stabaka-YY/ZZZZ.txt

    For Mooka Panchasati:
    - HTML: mookapanchasati/SECTION/ZZ/index.html
    - TXT: mookapanchasati/SECTION/ZZZZ.txt
    """
    html_path = Path(html_path)
    parts = html_path.parts

    # Find the base collection (umasahasranama or mookapanchasati)
    try:
        base_idx = None
        for i, part in enumerate(parts):
            if part in ['umasahasranama', 'mookapanchasati']:
                base_idx = i
                break

        if base_idx is None:
            return None

        collection = parts[base_idx]

        if collection == 'umasahasranama':
            # Expected structure: umasahasranama/shataka-XX/stabaka-YY/ZZ/index.html
            if len(parts) < base_idx + 5:
                return None

            shataka = parts[base_idx + 1]  # shataka-XX
            stabaka = parts[base_idx + 2]  # stabaka-YY
            sloka_num = parts[base_idx + 3]  # ZZ

            # Pad sloka number to 4 digits
            sloka_padded = sloka_num.zfill(4)

            txt_path = Path(base_dir) / collection / shataka / stabaka / f"{sloka_padded}.txt"

        elif collection == 'mookapanchasati':
            # Expected structure: mookapanchasati/SECTION/ZZ/index.html
            if len(parts) < base_idx + 4:
                return None

            section = parts[base_idx + 1]  # Section name
            sloka_num = parts[base_idx + 2]  # ZZ

            # Pad sloka number to 4 digits
            sloka_padded = sloka_num.zfill(4)

            txt_path = Path(base_dir) / collection / section / f"{sloka_padded}.txt"

        else:
            return None

        return txt_path if txt_path.exists() else None

    except (IndexError, ValueError):
        return None

def update_html_sloka(html_path, txt_path):
    """
    Update the sloka text in an HTML file with the content from the .txt file.
    """
    try:
        # Read the sloka text
        with open(txt_path, 'r', encoding='utf-8') as f:
            sloka_text = f.read().strip()

        # Read the HTML file
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()

        # Find the sloka-section div and update its content
        # Pattern: <div class="sloka-section">...CONTENT...</div>
        pattern = r'(<div class="sloka-section"[^>]*>)(.*?)(</div>)'

        def replace_sloka(match):
            opening = match.group(1)
            closing = match.group(3)

            # Convert newlines to <br> for HTML display
            formatted_sloka = sloka_text.replace('\n', '<br>\n            ')

            return f"{opening}\n            {formatted_sloka}\n        {closing}"

        # Replace the sloka content
        updated_html = re.sub(pattern, replace_sloka, html_content, flags=re.DOTALL)

        # Only write if content changed
        if updated_html != html_content:
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(updated_html)
            return True

        return False

    except Exception as e:
        print(f"Error updating {html_path}: {e}")
        return None

def process_directory(base_dir, collection):
    """
    Process all HTML files in a collection directory.
    """
    collection_path = Path(base_dir) / collection
    html_files = list(collection_path.rglob('*/index.html'))

    # Filter out top-level index.html files
    html_files = [f for f in html_files if f.parent.name != collection]

    count = 0
    skipped = 0
    errors = 0

    for html_file in html_files:
        txt_file = find_sloka_txt_file(html_file, base_dir)

        if txt_file is None:
            skipped += 1
            continue

        result = update_html_sloka(html_file, txt_file)

        if result is True:
            count += 1
        elif result is False:
            skipped += 1
        else:
            errors += 1

        if (count + skipped + errors) % 100 == 0:
            print(f"Progress: {count} updated, {skipped} skipped, {errors} errors")

    return count, skipped, errors

def main():
    base_dir = '/Users/adarshtadwai/Documents/GitHub/LalitaSahastranaamaCommentaries'

    collections = ['umasahasranama', 'mookapanchasati']

    total_count = 0
    total_skipped = 0
    total_errors = 0

    for collection in collections:
        print(f"\nProcessing: {collection}")
        count, skipped, errors = process_directory(base_dir, collection)
        total_count += count
        total_skipped += skipped
        total_errors += errors

        print(f"Completed: {count} files updated, {skipped} skipped, {errors} errors")

    print(f"\n{'='*60}")
    print(f"Total: {total_count} HTML files updated")
    print(f"Total: {total_skipped} files skipped")
    print(f"Total: {total_errors} errors")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
