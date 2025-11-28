#!/usr/bin/env python3
"""
Extract Sanskrit text from image using Tesseract OCR with preprocessing
"""

import sys
import cv2
import numpy as np
import pytesseract
from PIL import Image

def preprocess_image(image_path):
    """Preprocess image for better OCR accuracy"""
    # Read image
    img = cv2.imread(image_path)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Denoise
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)

    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 11, 2
    )

    # Dilate to make text slightly thicker (helps with faded text)
    kernel = np.ones((1, 1), np.uint8)
    dilated = cv2.dilate(thresh, kernel, iterations=1)

    # Optional: sharpen
    kernel_sharpen = np.array([[-1,-1,-1],
                               [-1, 9,-1],
                               [-1,-1,-1]])
    sharpened = cv2.filter2D(dilated, -1, kernel_sharpen)

    return sharpened

def extract_text(image_path, preprocess=True):
    """Extract Sanskrit text from image"""

    if preprocess:
        # Preprocess image
        processed_img = preprocess_image(image_path)

        # Convert back to PIL Image for pytesseract
        pil_img = Image.fromarray(processed_img)
    else:
        pil_img = Image.open(image_path)

    # Configure Tesseract for Sanskrit
    custom_config = r'--oem 3 --psm 6 -l san'

    # Extract text
    text = pytesseract.image_to_string(pil_img, config=custom_config)

    return text.strip()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 extract_text.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    print("Extracting text with preprocessing...")
    text = extract_text(image_path, preprocess=True)

    print("\n" + "="*80)
    print("EXTRACTED TEXT:")
    print("="*80)
    print(text)
    print("="*80)
