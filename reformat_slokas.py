#!/usr/bin/env python3
"""
Reformat sloka files to match Soundaryalahari's 2-line format.
Splits at the single danda (।) to create two lines.
"""

import os
import sys
import re

def reformat_sloka(text):
    """
    Reformat a single-line sloka into 2-line format.
    Splits at the position of ' ।' (space before single danda).
    """
    # Strip leading/trailing whitespace
    text = text.strip()

    # Find the position of ' ।' (space + single danda)
    match = re.search(r' ।', text)

    if not match:
        # If no single danda found, return as-is
        print(f"Warning: No single danda found in: {text[:50]}...")
        return text

    # Split at the single danda position
    split_pos = match.end()  # Position after ' ।'
    line1 = text[:split_pos]
    line2 = text[split_pos:].lstrip()  # Remove leading whitespace from line 2

    return f"{line1}\n{line2}"

def process_file(filepath):
    """
    Process a single sloka file and reformat it.
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if already formatted (has newline)
        if '\n' in content.strip():
            # Already has multiple lines, skip
            return False

        # Reformat
        reformatted = reformat_sloka(content)

        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(reformatted + '\n')

        return True
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def process_directory(directory):
    """
    Process all .txt files in a directory recursively.
    """
    count = 0
    skipped = 0
    errors = 0

    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.endswith('.txt'):
                filepath = os.path.join(root, filename)
                result = process_file(filepath)

                if result:
                    count += 1
                elif result is False and '\n' in open(filepath, 'r', encoding='utf-8').read().strip():
                    skipped += 1
                else:
                    errors += 1

                if (count + skipped + errors) % 100 == 0:
                    print(f"Progress: {count} reformatted, {skipped} skipped, {errors} errors")

    return count, skipped, errors

def main():
    base_path = '/Users/adarshtadwai/Documents/GitHub/LalitaSahastranaamaCommentaries'

    directories = [
        os.path.join(base_path, 'umasahasranama'),
        os.path.join(base_path, 'mookapanchasati')
    ]

    total_count = 0
    total_skipped = 0
    total_errors = 0

    for directory in directories:
        if not os.path.exists(directory):
            print(f"Directory not found: {directory}")
            continue

        print(f"\nProcessing: {directory}")
        count, skipped, errors = process_directory(directory)
        total_count += count
        total_skipped += skipped
        total_errors += errors

        print(f"Completed: {count} files reformatted, {skipped} skipped, {errors} errors")

    print(f"\n{'='*60}")
    print(f"Total: {total_count} files reformatted")
    print(f"Total: {total_skipped} files skipped (already formatted)")
    print(f"Total: {total_errors} errors")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
