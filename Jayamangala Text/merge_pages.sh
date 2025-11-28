#!/bin/bash
# Merge all Jayamangala page text files into a single file

OUTPUT_FILE="jayamangala_complete.txt"

# Remove old merged file if exists
rm -f "$OUTPUT_FILE"

# Get all numbered text files and sort them numerically
for file in $(ls [0-9]*.txt 2>/dev/null | sort -n -t. -k1); do
    cat "$file" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"  # Add blank line between pages
    echo "" >> "$OUTPUT_FILE"
done

echo "✅ Merged $(ls [0-9]*.txt 2>/dev/null | wc -l | tr -d ' ') pages into $OUTPUT_FILE"
