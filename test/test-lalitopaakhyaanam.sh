#!/bin/bash

# Test script for Lalitopakhyanam structure
# Run from repository root

echo "========================================="
echo "Testing Lalitopakhyanam Structure"
echo "========================================="
echo ""

PASS=0
FAIL=0

# Test 1: Check main index exists
if [ -f "lalitopaakhyaanam/index.html" ]; then
    echo "✓ Main index exists"
    ((PASS++))
else
    echo "✗ Main index missing"
    ((FAIL++))
fi

# Test 2: Check all 40 chapter folders exist
EXPECTED_CHAPTERS=40
ACTUAL_CHAPTERS=$(ls -d lalitopaakhyaanam/adhyaya-* 2>/dev/null | wc -l | tr -d ' ')
if [ "$ACTUAL_CHAPTERS" -eq "$EXPECTED_CHAPTERS" ]; then
    echo "✓ All $EXPECTED_CHAPTERS chapter folders exist"
    ((PASS++))
else
    echo "✗ Expected $EXPECTED_CHAPTERS chapters, found $ACTUAL_CHAPTERS"
    ((FAIL++))
fi

# Test 3: Check phala-shruti exists
if [ -d "lalitopaakhyaanam/phala-shruti" ]; then
    echo "✓ Phala-shruti folder exists"
    ((PASS++))
else
    echo "✗ Phala-shruti folder missing"
    ((FAIL++))
fi

# Test 4: Check each chapter has index.html
MISSING_INDEX=0
for i in $(seq -f "%02g" 1 40); do
    if [ ! -f "lalitopaakhyaanam/adhyaya-$i/index.html" ]; then
        echo "✗ Missing index for chapter $i"
        ((MISSING_INDEX++))
    fi
done
if [ "$MISSING_INDEX" -eq 0 ]; then
    echo "✓ All chapters have index.html"
    ((PASS++))
else
    echo "✗ $MISSING_INDEX chapters missing index.html"
    ((FAIL++))
fi

# Test 5: Check phala-shruti has index.html
if [ -f "lalitopaakhyaanam/phala-shruti/index.html" ]; then
    echo "✓ Phala-shruti has index.html"
    ((PASS++))
else
    echo "✗ Phala-shruti missing index.html"
    ((FAIL++))
fi

# Test 6: Verify sloka files are single-line format
echo ""
echo "Checking sloka format..."
MULTILINE=0
for file in lalitopaakhyaanam/adhyaya-01/00{01,02,03}.txt; do
    if [ -f "$file" ]; then
        LINES=$(wc -l < "$file" | tr -d ' ')
        if [ "$LINES" -gt 1 ]; then
            echo "✗ $file has $LINES lines (should be 1)"
            ((MULTILINE++))
        fi
    fi
done
if [ "$MULTILINE" -eq 0 ]; then
    echo "✓ Sample slokas are single-line format"
    ((PASS++))
else
    echo "✗ Found $MULTILINE multi-line slokas"
    ((FAIL++))
fi

# Test 7: Check total sloka count in a sample chapter
CHAPTER_05_SLOKAS=$(ls lalitopaakhyaanam/adhyaya-05/*.txt 2>/dev/null | wc -l | tr -d ' ')
if [ "$CHAPTER_05_SLOKAS" -gt 0 ]; then
    echo "✓ Chapter 5 has $CHAPTER_05_SLOKAS slokas"
    ((PASS++))
else
    echo "✗ Chapter 5 has no slokas"
    ((FAIL++))
fi

# Test 8: Check individual sloka pages exist for chapter 1
CHAPTER_01_PAGES=$(ls -d lalitopaakhyaanam/adhyaya-01/*/index.html 2>/dev/null | wc -l | tr -d ' ')
CHAPTER_01_SLOKAS=$(ls lalitopaakhyaanam/adhyaya-01/*.txt 2>/dev/null | wc -l | tr -d ' ')
if [ "$CHAPTER_01_PAGES" -eq "$CHAPTER_01_SLOKAS" ]; then
    echo "✓ Chapter 1 has matching sloka pages ($CHAPTER_01_PAGES pages for $CHAPTER_01_SLOKAS slokas)"
    ((PASS++))
else
    echo "✗ Chapter 1 mismatch: $CHAPTER_01_PAGES pages for $CHAPTER_01_SLOKAS slokas"
    ((FAIL++))
fi

# Summary
echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo "Passed: $PASS"
echo "Failed: $FAIL"
echo ""

if [ "$FAIL" -eq 0 ]; then
    echo "✓ All tests passed!"
    exit 0
else
    echo "✗ Some tests failed"
    exit 1
fi
