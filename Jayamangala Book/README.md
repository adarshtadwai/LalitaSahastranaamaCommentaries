# Jayamangala OCR Workflow

Split PDF into pages, then OCR them whenever you want.

## Step 1: Split PDF into Pages

```bash
cd "Jayamangala Book"
python3 split_pdf.py ~/Desktop/JayaMangala.pdf
```

This creates: `page_001.png`, `page_002.png`, etc.

## Step 2: OCR Pages (whenever you want)

```bash
python3 ocr_pages.py --api-key AIzaSyCxq9qwifKxmuDW9UoTJm8KiDrfR0PtqAw
```

Output in `../Jayamangala Text/`: `1.txt`, `2.txt`, `3.txt`, etc.

### Process Specific Pages

```bash
# Pages 1-20
python3 ocr_pages.py --api-key AIzaSyCxq9qwifKxmuDW9UoTJm8KiDrfR0PtqAw --start-page 1 --end-page 20

# Resume (skips already processed pages)
python3 ocr_pages.py --api-key AIzaSyCxq9qwifKxmuDW9UoTJm8KiDrfR0PtqAw
```

## Folder Structure

```
Jayamangala Book/
  ├── split_pdf.py          # Step 1: Split PDF
  ├── ocr_pages.py           # Step 2: OCR pages
  ├── page_001.png          # Page images
  ├── page_002.png
  └── ...

Jayamangala Text/
  ├── 1.txt                 # OCR output (just page number)
  ├── 2.txt
  ├── 3.txt
  └── ...
```

## Rate Limits

- 15 requests/minute
- 1,500 requests/day
- Script has 4-second delay (safe for limits)
- Auto-skips already processed pages
