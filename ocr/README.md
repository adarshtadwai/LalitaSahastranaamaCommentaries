# Sanskrit OCR with Google Gemini

High-quality OCR for Sanskrit texts using Google's Gemini API (~98% accuracy).

## Why Gemini?

- **~98% accuracy** on printed Sanskrit texts (per your testing)
- **Works on handwritten manuscripts** (better than expected performance)
- **No local setup complexity** - just API calls
- **Supports typeface priming** - can tell it about font/quality to improve results
- **Context-aware** - understands Sanskrit structure

## Models Available

- **gemini-2.0-flash-exp** (default) - Fast, excellent quality
- **gemini-1.5-pro** - Highest quality, slower
- **gemini-1.5-flash** - Fast, good quality

## Setup

### 1. Get API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy your API key

### 2. Install Dependencies

```bash
pip install google-generativeai pdf2image pillow
brew install poppler  # For PDF conversion
```

Or install in a virtual environment:

```bash
cd ocr
python3 -m venv venv
source venv/bin/activate
pip install google-generativeai pdf2image pillow
```

### 3. Set API Key

Either pass it as argument or set environment variable:

```bash
export GEMINI_API_KEY="your-api-key-here"
```

## Usage

### Basic Usage

```bash
python gemini_ocr.py ~/Desktop/JayaMangala.pdf --api-key YOUR_API_KEY
```

### Process Specific Pages (Test First!)

```bash
# Test on page 8
python gemini_ocr.py ~/Desktop/JayaMangala.pdf --api-key YOUR_API_KEY \
    --start-page 8 --end-page 8
```

### With Typeface Information

```bash
python gemini_ocr.py ~/Desktop/JayaMangala.pdf --api-key YOUR_API_KEY \
    --typeface "Traditional Sanskrit typeface, slightly faded print quality"
```

### With Context

```bash
python gemini_ocr.py ~/Desktop/JayaMangala.pdf --api-key YOUR_API_KEY \
    --context "Commentary on Lalita Sahasranama, Sanskrit verses with explanatory text"
```

### Full Example

```bash
python gemini_ocr.py ~/Desktop/JayaMangala.pdf \
    --api-key YOUR_API_KEY \
    --output-dir jayamangala_ocr \
    --model gemini-2.0-flash-exp \
    --typeface "Clear Devanagari typeface" \
    --context "Sanskrit commentary with verses and prose explanation" \
    --dpi 300
```

## Output Files

The script creates:

```
ocr_output/
├── images/                          # Extracted page images
│   ├── JayaMangala_page_001.png
│   ├── JayaMangala_page_002.png
│   └── ...
├── JayaMangala_ocr.txt             # Plain text output
├── JayaMangala_ocr.json            # Structured JSON with metadata
└── JayaMangala_proofreading.json   # Template for corrections
```

## Workflow

### 1. Test on Single Page

```bash
# Test page 8 that you extracted earlier
python gemini_ocr.py ~/Desktop/JayaMangala.pdf \
    --api-key YOUR_API_KEY \
    --start-page 8 --end-page 8 \
    --output-dir test_ocr
```

### 2. Review Quality

```bash
cat test_ocr/JayaMangala_ocr.txt
```

Compare with the Tesseract output you saw earlier. Gemini should be much better.

### 3. Process Full Document

If satisfied with quality:

```bash
python gemini_ocr.py ~/Desktop/JayaMangala.pdf \
    --api-key YOUR_API_KEY \
    --output-dir jayamangala_ocr
```

### 4. Proofread

Open `jayamangala_ocr/JayaMangala_proofreading.json`:

```json
{
  "pages": [
    {
      "page_number": 1,
      "ocr_text": "श्रीललितासहस्रनामस्तोत्रम्...",
      "corrected_text": "",  // Add corrections here
      "needs_review": false,
      "notes": "",
      "status": "pending"
    }
  ]
}
```

### 5. Publish to Website

Use your existing edit module to add the corrected text to the website.

## Tips for Best Results

### 1. Typeface Priming

If you notice issues, describe the typeface:

```bash
--typeface "Traditional Sanskrit font, slightly faded, some light ink spots"
```

### 2. Context Helps

Tell Gemini what kind of text it is:

```bash
--context "Bhashya commentary, includes verses followed by prose explanation"
```

### 3. Scan Quality Matters

- 300 DPI is recommended (default)
- Higher DPI (600) can help with faded text but slower
- Clean scans = better results

### 4. Page Range Testing

Always test a few pages first to check quality:

```bash
--start-page 8 --end-page 10
```

## Cost Estimation

Google AI Studio pricing (as of 2024):

- **Gemini 2.0 Flash**: Free tier available
- **Gemini 1.5 Pro**: Pay-per-use after free tier

For a 200-page book:
- Estimated cost: $0-5 depending on usage tier
- Much cheaper than manual typing!

Check current pricing: https://ai.google.dev/pricing

## Comparison with Other Methods

| Method | Accuracy | Speed | Cost | Setup |
|--------|----------|-------|------|-------|
| **Gemini 2.0 Flash** | **~98%** | Fast | Free/Low | Easy ✅ |
| IndicOCR-v2 | ~96% | Medium | Free | Complex (ARM64 issues) |
| Tesseract | ~70-80% | Fast | Free | Easy |
| Google Cloud Vision | ~90-93% | Fast | $$$ | Medium |

## Troubleshooting

### "Missing dependency" error

```bash
pip install google-generativeai pdf2image pillow
brew install poppler
```

### "API key required" error

Either:
1. Pass `--api-key YOUR_API_KEY`
2. Set `export GEMINI_API_KEY=YOUR_API_KEY`

### Rate limit errors

The script includes automatic retry with exponential backoff. If you still hit limits:
1. Add `time.sleep(2)` between pages (modify line with `time.sleep(1)`)
2. Use `gemini-1.5-flash` instead of `gemini-2.0-flash-exp`

### Poor quality results

1. Try higher DPI: `--dpi 600`
2. Add typeface info: `--typeface "description"`
3. Add context: `--context "type of text"`
4. Try `gemini-1.5-pro` model (slower but highest quality)

## Examples

### Process entire book

```bash
python gemini_ocr.py ~/Desktop/JayaMangala.pdf \
    --api-key YOUR_API_KEY \
    --output-dir jayamangala_complete
```

### High quality scan

```bash
python gemini_ocr.py ~/Desktop/HighQuality.pdf \
    --api-key YOUR_API_KEY \
    --model gemini-2.0-flash-exp \
    --dpi 300
```

### Faded/poor quality scan

```bash
python gemini_ocr.py ~/Desktop/FadedScan.pdf \
    --api-key YOUR_API_KEY \
    --model gemini-1.5-pro \
    --dpi 600 \
    --typeface "Faded print, light ink, traditional Sanskrit font"
```

### Handwritten manuscript (experimental)

```bash
python gemini_ocr.py ~/Desktop/Manuscript.pdf \
    --api-key YOUR_API_KEY \
    --model gemini-1.5-pro \
    --dpi 600 \
    --typeface "Handwritten Devanagari script, clear penmanship" \
    --context "Handwritten pandulipis"
```

## Next Steps

After OCR is complete:
1. Review the `.txt` file for overall quality
2. Use the `_proofreading.json` file to make corrections
3. Integrate corrected text into your website using the edit module
4. Build and deploy updated website

---

**Created**: 2025-11-27
**Based on**: User testing showing ~98% accuracy with Gemini 2.5/3 Pro on Sanskrit texts
**Tested**: Handwritten pandulipis - "Performance worse than printed material but much better than expected"
