# app/ocr.py
from PIL import Image
import pytesseract
import io
import pdfplumber
import fitz  # PyMuPDF
import os
import platform

# Configure Tesseract path for Windows
if platform.system() == "Windows":
    # Common Tesseract installation paths on Windows
    possible_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        r"C:\Users\{username}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe".format(username=os.getenv('USERNAME')),
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            print(f"DEBUG - Found Tesseract at: {path}")
            break
    else:
        print("DEBUG - Tesseract not found in common paths. Make sure it's in PATH or install it.")

def test_tesseract():
    """Test if Tesseract is working properly"""
    try:
        # Create a simple test image with text
        from PIL import Image, ImageDraw, ImageFont
        img = Image.new('RGB', (200, 50), color='white')
        draw = ImageDraw.Draw(img)
        draw.text((10, 10), "TEST 123", fill='black')
        
        # Try OCR on the test image
        result = pytesseract.image_to_string(img).strip()
        print(f"DEBUG - Tesseract test result: '{result}'")
        return "TEST" in result or "123" in result
    except Exception as e:
        print(f"DEBUG - Tesseract test failed: {str(e)}")
        return False

def extract_text_from_file(filename, content):
    file_ext = filename.lower().split('.')[-1]
    print(f"DEBUG - Processing file: {filename}, type: {file_ext}, size: {len(content)} bytes")
    
    # Test Tesseract on first run
    if not hasattr(extract_text_from_file, '_tesseract_tested'):
        print("DEBUG - Testing Tesseract installation...")
        extract_text_from_file._tesseract_tested = test_tesseract()
        if not extract_text_from_file._tesseract_tested:
            return "Tesseract OCR is not properly installed or configured"

    if file_ext == "pdf":
        try:
            # Step 1: Try pdfplumber (for actual text layer)
            print("DEBUG - Trying pdfplumber text extraction...")
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                text = "\n".join([page.extract_text() or "" for page in pdf.pages])
                if text.strip():
                    print(f"DEBUG - pdfplumber extracted {len(text)} characters")
                    return text
                else:
                    print("DEBUG - pdfplumber found no text, trying OCR...")

            # Step 2: Fallback - use OCR on images from PDF pages
            print("DEBUG - Using PyMuPDF + Tesseract OCR...")
            doc = fitz.open(stream=content, filetype="pdf")
            text = ""
            for page_num, page in enumerate(doc):
                print(f"DEBUG - Processing page {page_num + 1}...")
                pix = page.get_pixmap(dpi=300)
                img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
                page_text = pytesseract.image_to_string(img, config='--psm 6')
                text += page_text + "\n"
                print(f"DEBUG - Page {page_num + 1} extracted {len(page_text)} characters")
            
            print(f"DEBUG - Total OCR extracted {len(text)} characters")
            if text.strip():
                return text
            else:
                return "No text could be extracted from PDF"

        except Exception as e:
            print(f"DEBUG - OCR Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return f"OCR failed: {str(e)}"

    elif file_ext in ["jpg", "jpeg", "png"]:
        try:
            image = Image.open(io.BytesIO(content)).convert("RGB")
            return pytesseract.image_to_string(image)
        except Exception as e:
            return f"OCR failed for image: {str(e)}"

    else:
        raise ValueError("Unsupported file type: only PDF, JPG, JPEG, PNG allowed.")
