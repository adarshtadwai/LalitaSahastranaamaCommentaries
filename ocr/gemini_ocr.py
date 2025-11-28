#!/usr/bin/env python3
"""
Sanskrit OCR using Google Gemini API
~98% accuracy for printed Sanskrit texts
Supports PDF and image files
"""

import os
import sys
import json
import time
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime

try:
    import google.generativeai as genai
    from pdf2image import convert_from_path
    from PIL import Image
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("\nPlease install required packages:")
    print("  pip install google-generativeai pdf2image pillow")
    print("\nFor pdf2image, you also need poppler:")
    print("  brew install poppler")
    sys.exit(1)


class GeminiOCR:
    """OCR processor using Google Gemini API"""

    def __init__(self, api_key: str, model: str = "gemini-2.0-flash-exp"):
        """
        Initialize Gemini OCR

        Args:
            api_key: Google AI Studio API key
            model: Model to use (gemini-2.0-flash-exp, gemini-1.5-pro, gemini-1.5-flash)
        """
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model)
        self.model_name = model

    def create_prompt(self, typeface: Optional[str] = None, context: Optional[str] = None) -> str:
        """
        Create OCR prompt with optional context

        Args:
            typeface: Description of the typeface/font used
            context: Additional context about the text
        """
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
            prompt += f"\nTypeface/Font information: {typeface}"

        if context:
            prompt += f"\nContext: {context}"

        prompt += "\n\nReturn ONLY the extracted text, nothing else."

        return prompt

    def ocr_image(self, image_path: str, typeface: Optional[str] = None,
                  context: Optional[str] = None, retry_count: int = 3) -> Dict:
        """
        Perform OCR on a single image

        Args:
            image_path: Path to image file
            typeface: Optional typeface description
            context: Optional context about the text
            retry_count: Number of retries on failure

        Returns:
            Dict with text, confidence, and metadata
        """
        image = Image.open(image_path)
        prompt = self.create_prompt(typeface, context)

        for attempt in range(retry_count):
            try:
                response = self.model.generate_content([prompt, image])

                # Check if response was blocked
                if not response.text:
                    if response.prompt_feedback:
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
                if attempt < retry_count - 1:
                    wait_time = 2 ** attempt  # Exponential backoff
                    print(f"  ⚠️  Attempt {attempt + 1} failed: {e}")
                    print(f"  Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    return {
                        'text': '',
                        'error': str(e),
                        'success': False
                    }

        return {'text': '', 'error': 'Max retries exceeded', 'success': False}

    def process_pdf(self, pdf_path: str, output_dir: str,
                    typeface: Optional[str] = None,
                    context: Optional[str] = None,
                    dpi: int = 300,
                    start_page: Optional[int] = None,
                    end_page: Optional[int] = None) -> Dict:
        """
        Process entire PDF with OCR

        Args:
            pdf_path: Path to PDF file
            output_dir: Directory to save results
            typeface: Optional typeface description
            context: Optional context about the text
            dpi: DPI for PDF conversion (300 recommended)
            start_page: Optional starting page (1-indexed)
            end_page: Optional ending page (1-indexed)

        Returns:
            Dict with results and metadata
        """
        pdf_path = Path(pdf_path)
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        # Create subdirectories
        images_dir = output_dir / 'images'
        images_dir.mkdir(exist_ok=True)

        print(f"📄 Converting PDF to images (DPI: {dpi})...")

        # Convert PDF to images
        pages = convert_from_path(
            str(pdf_path),
            dpi=dpi,
            fmt='png',
            first_page=start_page,
            last_page=end_page
        )

        print(f"✅ Converted {len(pages)} page(s)")
        print(f"🔍 Starting OCR with {self.model_name}...")
        print()

        results = []
        total_chars = 0

        for i, page_image in enumerate(pages, start=start_page or 1):
            # Save image
            image_filename = f'{pdf_path.stem}_page_{i:03d}.png'
            image_path = images_dir / image_filename
            page_image.save(image_path, 'PNG')

            print(f"Page {i}/{len(pages) + (start_page or 1) - 1}: ", end='', flush=True)

            # Perform OCR
            result = self.ocr_image(str(image_path), typeface, context)

            if result['success']:
                char_count = len(result['text'])
                total_chars += char_count
                print(f"✅ {char_count} characters")

                results.append({
                    'page_number': i,
                    'image_file': image_filename,
                    'text': result['text'],
                    'char_count': char_count,
                    'model': result['model'],
                    'success': True
                })
            else:
                print(f"❌ Failed: {result.get('error', 'Unknown error')}")
                results.append({
                    'page_number': i,
                    'image_file': image_filename,
                    'text': '',
                    'error': result.get('error'),
                    'success': False
                })

            # Rate limiting - be nice to the API
            time.sleep(1)

        # Save results
        print()
        print("💾 Saving results...")

        # Save as JSON
        json_output = output_dir / f'{pdf_path.stem}_ocr.json'
        output_data = {
            'metadata': {
                'source_file': str(pdf_path),
                'model': self.model_name,
                'timestamp': datetime.now().isoformat(),
                'total_pages': len(results),
                'total_characters': total_chars,
                'dpi': dpi,
                'typeface': typeface,
                'context': context
            },
            'pages': results
        }

        with open(json_output, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)

        # Save as plain text
        txt_output = output_dir / f'{pdf_path.stem}_ocr.txt'
        with open(txt_output, 'w', encoding='utf-8') as f:
            for result in results:
                if result['success']:
                    f.write(f"{'='*80}\n")
                    f.write(f"Page {result['page_number']}\n")
                    f.write(f"{'='*80}\n\n")
                    f.write(result['text'])
                    f.write('\n\n')

        # Create proofreading template
        proofreading_output = output_dir / f'{pdf_path.stem}_proofreading.json'
        proofreading_data = {
            'project': 'Lalita Sahasranama Commentaries',
            'source_file': str(pdf_path),
            'ocr_method': f'Google Gemini {self.model_name}',
            'expected_accuracy': '~98%',
            'date': datetime.now().isoformat(),
            'pages': []
        }

        for result in results:
            proofreading_data['pages'].append({
                'page_number': result['page_number'],
                'image_file': result['image_file'],
                'ocr_text': result.get('text', ''),
                'corrected_text': '',
                'needs_review': not result['success'],
                'notes': result.get('error', ''),
                'status': 'pending'
            })

        with open(proofreading_output, 'w', encoding='utf-8') as f:
            json.dump(proofreading_data, f, ensure_ascii=False, indent=2)

        print()
        print("━" * 80)
        print("✅ OCR COMPLETE!")
        print("━" * 80)
        print()
        print(f"📊 Summary:")
        print(f"  • Model: {self.model_name}")
        print(f"  • Pages processed: {len(results)}")
        print(f"  • Total characters: {total_chars:,}")
        print(f"  • Success rate: {sum(1 for r in results if r['success'])}/{len(results)}")
        print()
        print(f"📁 Results saved to:")
        print(f"  • Text: {txt_output}")
        print(f"  • JSON: {json_output}")
        print(f"  • Proofreading: {proofreading_output}")
        print(f"  • Images: {images_dir}/")
        print()
        print("📝 Next steps:")
        print("  1. Review the OCR text in the .txt file")
        print(f"  2. Proofread and correct using: {proofreading_output}")
        print("  3. Copy corrected text to your website")
        print()

        return output_data


def main():
    """Main entry point"""
    import argparse

    parser = argparse.ArgumentParser(
        description='Sanskrit OCR using Google Gemini API (~98% accuracy)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  # Process entire PDF
  python gemini_ocr.py commentary.pdf --api-key YOUR_API_KEY

  # Process specific pages
  python gemini_ocr.py commentary.pdf --api-key YOUR_API_KEY --start-page 1 --end-page 10

  # With typeface information
  python gemini_ocr.py commentary.pdf --api-key YOUR_API_KEY \\
      --typeface "Traditional Sanskrit typeface with clear diacriticals"

  # With context
  python gemini_ocr.py commentary.pdf --api-key YOUR_API_KEY \\
      --context "Commentary on Lalita Sahasranama, mixture of Sanskrit and explanatory text"

Models:
  - gemini-2.0-flash-exp (default, fast, good quality)
  - gemini-1.5-pro (highest quality, slower)
  - gemini-1.5-flash (fast, good quality)

Get API key from: https://aistudio.google.com/apikey
        '''
    )

    parser.add_argument('pdf_file', help='Path to PDF file')
    parser.add_argument('--api-key', help='Google AI Studio API key (or set GEMINI_API_KEY env var)')
    parser.add_argument('--output-dir', default='ocr_output', help='Output directory (default: ocr_output)')
    parser.add_argument('--model', default='gemini-2.5-flash',
                       choices=['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash-exp', 'gemini-2.0-flash', 'gemini-pro-latest'],
                       help='Gemini model to use (default: gemini-2.5-flash)')
    parser.add_argument('--typeface', help='Description of typeface/font used')
    parser.add_argument('--context', help='Context about the text content')
    parser.add_argument('--dpi', type=int, default=300, help='DPI for PDF conversion (default: 300)')
    parser.add_argument('--start-page', type=int, help='Starting page number (1-indexed)')
    parser.add_argument('--end-page', type=int, help='Ending page number (1-indexed)')

    args = parser.parse_args()

    # Get API key
    api_key = args.api_key or os.environ.get('GEMINI_API_KEY')
    if not api_key:
        print("❌ Error: API key required")
        print()
        print("Either:")
        print("  1. Pass --api-key YOUR_API_KEY")
        print("  2. Set environment variable: export GEMINI_API_KEY=YOUR_API_KEY")
        print()
        print("Get your API key from: https://aistudio.google.com/apikey")
        sys.exit(1)

    # Check if PDF exists
    if not os.path.exists(args.pdf_file):
        print(f"❌ Error: File not found: {args.pdf_file}")
        sys.exit(1)

    print()
    print("━" * 80)
    print("Sanskrit OCR with Google Gemini")
    print("━" * 80)
    print()

    # Initialize OCR
    ocr = GeminiOCR(api_key, model=args.model)

    # Process PDF
    try:
        ocr.process_pdf(
            pdf_path=args.pdf_file,
            output_dir=args.output_dir,
            typeface=args.typeface,
            context=args.context,
            dpi=args.dpi,
            start_page=args.start_page,
            end_page=args.end_page
        )
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
