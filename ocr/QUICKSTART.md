# Quick Start Guide - Gemini OCR

## 🎯 Your API Key
```
YOUR_API_KEY_HERE
```

Get your API key from: https://aistudio.google.com/apikey

## 📦 One-Time Setup

```bash
cd ~/Documents/GitHub/LalitaSahastranaamaCommentaries

# Install dependencies
pip3 install google-generativeai pdf2image pillow

# Or if that fails (system packages protected):
pip3 install --user google-generativeai pdf2image pillow
```

## 🚀 Test on Single Page

```bash
python3 ocr/gemini_ocr.py ~/Desktop/JayaMangala.pdf \
    --api-key YOUR_API_KEY_HERE \
    --start-page 8 --end-page 8 \
    --output-dir test_page8 \
    --model gemini-2.5-flash
```

View results:
```bash
cat test_page8/JayaMangala_ocr.txt
```

## 📖 Process Entire Book

Once you're happy with quality:

```bash
python3 ocr/gemini_ocr.py ~/Desktop/JayaMangala.pdf \
    --api-key YOUR_API_KEY_HERE \
    --output-dir jayamangala_full \
    --model gemini-2.5-flash
```

## ⚙️ Available Models

From fastest to highest quality:

1. **gemini-2.5-flash** (recommended) - Fast, excellent quality
2. **gemini-2.5-pro** - Highest quality, slower, may cost more
3. **gemini-2.0-flash-exp** - Experimental, fast

## 💡 Tips

### For clear scans:
```bash
--model gemini-2.5-flash
```

### For faded/poor quality scans:
```bash
--model gemini-2.5-pro \
--dpi 600 \
--typeface "Faded print, light ink"
```

### For handwritten text:
```bash
--model gemini-2.5-pro \
--dpi 600 \
--typeface "Handwritten Devanagari" \
--context "Handwritten pandulipis"
```

## 📊 Output Files

After OCR completes, you'll get:

```
jayamangala_full/
├── images/                    # Page images (for reference)
├── JayaMangala_ocr.txt       # Plain text (easy to read)
├── JayaMangala_ocr.json      # Structured data
└── JayaMangala_proofreading.json  # For corrections
```

## ✏️ Proofreading

1. Open `JayaMangala_proofreading.json`
2. For each page, copy `ocr_text` to `corrected_text` and fix errors
3. Update `status` to "completed" when done

## 🚫 Troubleshooting

### Quota exceeded (429 error)
Wait 1 minute and try again. Free tier has rate limits.

### Model not found (404 error)
Use one of these models:
- `gemini-2.5-flash`
- `gemini-2.5-pro`
- `gemini-2.0-flash-exp`

### Missing dependencies
```bash
pip3 install google-generativeai pdf2image pillow
brew install poppler
```

## 📈 Quality Comparison

Based on your testing:

- **Gemini 2.5/3 Pro**: ~98% accuracy ✅
- **IndicOCR-v2**: ~96% accuracy (but ARM64 issues)
- **Tesseract**: ~70-80% accuracy

## ⏱️ Processing Time

For a 200-page book:
- PDF to images: ~2-5 minutes
- OCR with Gemini: ~3-6 minutes (with rate limiting)
- **Total: ~10 minutes** for ~98% accurate text!

---

**Next**: After OCR is complete, use your website's edit module to publish the corrected text.
