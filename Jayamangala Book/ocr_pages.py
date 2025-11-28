#!/usr/bin/env python3
"""
OCR individual page images using Google Gemini API
Processes images from 'Jayamangala Book' directory
Saves text to 'Jayamangala Text' directory
"""

import os
import sys
import json
import time
from pathlib import Path
from datetime import datetime

try:
    import google.generativeai as genai
    from PIL import Image
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("\nPlease install:")
    print("  pip3 install google-generativeai pillow")
    sys.exit(1)


class PageOCR:
    """OCR processor for individual pages"""

    def __init__(self, api_key, model="gemini-2.5-flash"):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model)
        self.model_name = model

    def create_prompt(self, typeface=None, context=None):
        """Create OCR prompt"""
        prompt = """Extract all text from this image with perfect accuracy.

This is a Sanskrit text in Devanagari script. Please:
1. Extract ALL text exactly as it appears
2. Preserve all diacritical marks (matras, bindu, visarga, chandrabindu, etc.)
3. Maintain line breaks and paragraph structure
4. Include all punctuation marks
5. Do NOT translate or interpret - only transcribe
6. If any character is unclear, mark it with [?]
"""

        if typeface:
            prompt += f"\nTypeface/Font: {typeface}"

        if context:
            prompt += f"\nContext: {context}"

        prompt += "\n\nReturn ONLY the extracted text, nothing else."
        return prompt

    def ocr_image(self, image_path, typeface=None, context=None, retry_count=3):
        """Perform OCR on single image"""
        image = Image.open(image_path)
        prompt = self.create_prompt(typeface, context)

        for attempt in range(retry_count):
            try:
                response = self.model.generate_content([prompt, image])

                if not response.text:
                    return {
                        'text': '',
                        'error': f'Response blocked: {response.prompt_feedback}',
                        'success': False
                    }

                return {
                    'text': response.text.strip(),
                    'model': self.model_name,
                    'success': True,
                    'attempt': attempt + 1
                }

            except Exception as e:
                error_str = str(e)

                # Check for rate limit
                if '429' in error_str or 'quota' in error_str.lower():
                    if attempt < retry_count - 1:
                        wait_time = 60  # Wait 1 minute for rate limit
                        print(f"  ⚠️  Rate limit hit. Waiting {wait_time}s...")
                        time.sleep(wait_time)
                        continue
                    else:
                        return {
                            'text': '',
                            'error': 'Rate limit exceeded',
                            'success': False,
                            'retry_later': True
                        }

                if attempt < retry_count - 1:
                    wait_time = 2 ** attempt
                    print(f"  ⚠️  Attempt {attempt + 1} failed: {e}")
                    print(f"  Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                else:
                    return {
                        'text': '',
                        'error': str(e),
                        'success': False
                    }

        return {'text': '', 'error': 'Max retries exceeded', 'success': False}


def process_pages(images_dir, text_dir, api_key, start_page=None, end_page=None,
                  typeface=None, context=None, model="gemini-2.5-flash", delay=4):
    """
    Process page images with OCR

    Args:
        images_dir: Directory with page images
        text_dir: Directory to save text files
        api_key: Gemini API key
        start_page: Starting page number (optional)
        end_page: Ending page number (optional)
        typeface: Typeface description (optional)
        context: Context about text (optional)
        model: Gemini model to use
        delay: Delay between requests in seconds (default 4)
    """
    images_dir = Path(images_dir)
    text_dir = Path(text_dir)

    # Create text directory
    text_dir.mkdir(parents=True, exist_ok=True)

    # Find all page images
    page_files = sorted(images_dir.glob("page_*.png"))

    if not page_files:
        print(f"❌ No page images found in: {images_dir}")
        print("Run split_pdf.py first to create page images")
        return

    # Filter by page range if specified
    if start_page or end_page:
        start_idx = (start_page - 1) if start_page else 0
        end_idx = end_page if end_page else len(page_files)
        page_files = page_files[start_idx:end_idx]

    print("━" * 80)
    print("Sanskrit OCR with Google Gemini")
    print("━" * 80)
    print()
    print(f"📁 Images: {images_dir}")
    print(f"📁 Output: {text_dir}")
    print(f"🔍 Model: {model}")
    print(f"📄 Pages to process: {len(page_files)}")
    print(f"⏱️  Delay between requests: {delay}s")
    print()

    # Initialize OCR
    ocr = PageOCR(api_key, model)

    # Track progress
    successful = 0
    failed = []

    # Process each page
    for i, page_file in enumerate(page_files, start=1):
        page_num = int(page_file.stem.split('_')[1])
        txt_file = text_dir / f"{page_num}.txt"

        # Skip if already processed
        if txt_file.exists():
            print(f"Page {page_num}: ⏭️  Already exists, skipping")
            successful += 1
            continue

        print(f"Page {page_num} ({i}/{len(page_files)}): ", end='', flush=True)

        # Perform OCR
        result = ocr.ocr_image(str(page_file), typeface, context)

        if result['success']:
            # Save text file with just the text content, no extra formatting
            with open(txt_file, 'w', encoding='utf-8') as f:
                f.write(result['text'])

            char_count = len(result['text'])
            print(f"✅ {char_count} characters")
            successful += 1

        else:
            print(f"❌ {result.get('error', 'Unknown error')}")
            failed.append({
                'page': page_num,
                'file': str(page_file),
                'error': result.get('error')
            })

            # If rate limit, stop processing
            if result.get('retry_later'):
                print()
                print("⚠️  Rate limit reached. Stopping here.")
                print("You can resume later by running the same command.")
                break

        # Delay to respect rate limits
        if i < len(page_files):
            time.sleep(delay)

    # Summary
    print()
    print("━" * 80)
    print("✅ OCR SESSION COMPLETE")
    print("━" * 80)
    print()
    print(f"📊 Summary:")
    print(f"  • Successful: {successful}/{len(page_files)}")
    print(f"  • Failed: {len(failed)}")
    print(f"  • Text files: {text_dir}")
    print()

    if failed:
        print("❌ Failed pages:")
        for item in failed:
            print(f"  • Page {item['page']}: {item['error']}")
        print()

    # Save progress log
    log_file = text_dir / 'ocr_log.json'
    log_data = {
        'timestamp': datetime.now().isoformat(),
        'model': model,
        'total_pages': len(page_files),
        'successful': successful,
        'failed': failed
    }

    with open(log_file, 'w', encoding='utf-8') as f:
        json.dump(log_data, f, ensure_ascii=False, indent=2)

    print(f"📝 Log saved: {log_file}")
    print()


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='OCR page images using Google Gemini API',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  # Process all pages
  python ocr_pages.py --api-key YOUR_API_KEY

  # Process specific range
  python ocr_pages.py --api-key YOUR_API_KEY --start-page 1 --end-page 20

  # Resume from where you left off (skips existing files)
  python ocr_pages.py --api-key YOUR_API_KEY

  # With typeface info
  python ocr_pages.py --api-key YOUR_API_KEY \\
      --typeface "Clear Devanagari print"

API Key: Get from https://aistudio.google.com/apikey
        '''
    )

    parser.add_argument('--api-key', required=True,
                       help='Google AI Studio API key')
    parser.add_argument('--images-dir', default='.',
                       help='Directory with page images (default: current dir)')
    parser.add_argument('--text-dir', default='../Jayamangala Text',
                       help='Directory for text output (default: ../Jayamangala Text)')
    parser.add_argument('--model', default='gemini-2.5-flash',
                       choices=['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash-exp'],
                       help='Gemini model (default: gemini-2.5-flash)')
    parser.add_argument('--start-page', type=int,
                       help='Starting page number')
    parser.add_argument('--end-page', type=int,
                       help='Ending page number')
    parser.add_argument('--typeface',
                       help='Description of typeface/font')
    parser.add_argument('--context',
                       help='Context about the text')
    parser.add_argument('--delay', type=int, default=4,
                       help='Delay between requests in seconds (default: 4)')

    args = parser.parse_args()

    process_pages(
        images_dir=args.images_dir,
        text_dir=args.text_dir,
        api_key=args.api_key,
        start_page=args.start_page,
        end_page=args.end_page,
        typeface=args.typeface,
        context=args.context,
        model=args.model,
        delay=args.delay
    )


if __name__ == '__main__':
    main()
