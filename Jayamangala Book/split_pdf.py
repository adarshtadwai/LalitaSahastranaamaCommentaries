#!/usr/bin/env python3
"""
Split PDF into individual page images
Each page saved as PNG in the same directory
"""

import os
import sys
from pathlib import Path

try:
    from pdf2image import convert_from_path
except ImportError:
    print("Missing dependency: pdf2image")
    print("\nPlease install:")
    print("  pip3 install pdf2image")
    sys.exit(1)


def split_pdf(pdf_path, output_dir=None, dpi=300):
    """
    Split PDF into individual page images

    Args:
        pdf_path: Path to PDF file
        output_dir: Output directory (defaults to same dir as script)
        dpi: Resolution (default 300)
    """
    pdf_path = Path(pdf_path)

    if not pdf_path.exists():
        print(f"❌ Error: File not found: {pdf_path}")
        return

    # Default output to script directory
    if output_dir is None:
        output_dir = Path(__file__).parent
    else:
        output_dir = Path(output_dir)

    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"📄 Splitting PDF: {pdf_path.name}")
    print(f"📁 Output directory: {output_dir}")
    print(f"🔍 DPI: {dpi}")
    print()

    # Convert PDF to images
    print("Converting pages...")
    pages = convert_from_path(str(pdf_path), dpi=dpi, fmt='png')

    print(f"✅ Total pages: {len(pages)}")
    print()

    # Save each page
    for i, page in enumerate(pages, start=1):
        output_filename = f"page_{i:03d}.png"
        output_path = output_dir / output_filename

        page.save(output_path, 'PNG')

        # Show progress every 10 pages
        if i % 10 == 0:
            print(f"  Saved {i}/{len(pages)} pages...")

    print()
    print(f"✅ All {len(pages)} pages saved!")
    print()
    print(f"📊 Summary:")
    print(f"  • Pages: {len(pages)}")
    print(f"  • Location: {output_dir}")
    print(f"  • Files: page_001.png to page_{len(pages):03d}.png")
    print()


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(
        description='Split PDF into individual page images'
    )
    parser.add_argument('pdf_file', help='Path to PDF file')
    parser.add_argument('--output-dir', help='Output directory (default: script directory)')
    parser.add_argument('--dpi', type=int, default=300, help='DPI (default: 300)')

    args = parser.parse_args()

    split_pdf(args.pdf_file, args.output_dir, args.dpi)
