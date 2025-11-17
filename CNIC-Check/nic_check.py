import cv2
import pytesseract
from PIL import Image
import numpy as np
import re

def crop_and_preprocess(image_path):
    """Crop and preprocess CNIC image for optimal OCR"""
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image from {image_path}")
    
    height, width = img.shape[:2]
    
    # Crop margins
    margin = 30
    cropped = img[margin:height-margin, margin:width-margin]
    
    # Convert to grayscale
    gray = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)
    
    # Increase contrast using CLAHE
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    contrast = clahe.apply(gray)
    
    # Resize for better OCR (scale up 3x for better number recognition)
    scaled = cv2.resize(contrast, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
    
    # Apply Gaussian blur before denoising
    blurred = cv2.GaussianBlur(scaled, (3, 3), 0)
    
    # Denoise
    denoised = cv2.fastNlMeansDenoising(blurred, None, 10, 7, 21)
    
    # Apply binary threshold
    _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Dilate slightly to connect broken digits
    kernel = np.ones((2, 2), np.uint8)
    dilated = cv2.dilate(binary, kernel, iterations=1)
    
    return dilated

def extract_cnic_data(image_path):
    """Extract and structure CNIC data"""
    print(f"Processing: {image_path}")
    
    # Preprocess image
    processed = crop_and_preprocess(image_path)
    cv2.imwrite('preprocessed_debug.jpg', processed)
    print("Preprocessed image saved")
    
    # Extract text with best settings for numbers
    pil_img = Image.fromarray(processed)
    # Use PSM 6 (uniform block of text) and specify digits priority
    custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz./ '
    text = pytesseract.image_to_string(pil_img, config=custom_config)
    
    # Parse CNIC data
    cnic_data = {
        'raw_text': text,
        'name': None,
        'father_name': None,
        'cnic_number': None,
        'date_of_birth': None,
        'date_of_issue': None,
        'date_of_expiry': None,
        'gender': None,
        'country': None,
        'is_valid_cnic': False
    }
    
    lines = text.split('\n')
    
    # Extract CNIC Number - look for 13 digit pattern with better accuracy
    # Try to find line with "Identity" or date pattern nearby
    cnic_candidates = []
    
    for i, line in enumerate(lines):
        # Look for CNIC pattern
        # Pattern 1: XXXXX-XXXXXXX-X
        matches = re.findall(r'\b(\d{5})[-\s]?(\d{7})[-\s]?(\d)\b', line)
        for match in matches:
            cnic_num = f"{match[0]}-{match[1]}-{match[2]}"
            # Check if this line has context clues (near Identity or date)
            context_score = 0
            if i > 0 and ('identity' in lines[i-1].lower() or 'birth' in lines[i-1].lower()):
                context_score += 2
            if re.search(r'\d{2}\.\d{2}\.\d{4}', line):
                context_score += 1
            cnic_candidates.append((cnic_num, context_score, i, line))
        
        # Pattern 2: 13 consecutive digits
        if len(cnic_candidates) == 0:
            match = re.search(r'\b(\d{13})\b', line)
            if match:
                cnic_num = match.group(1)
                formatted = f"{cnic_num[:5]}-{cnic_num[5:12]}-{cnic_num[12]}"
                context_score = 0
                if i > 0 and 'identity' in lines[i-1].lower():
                    context_score += 2
                cnic_candidates.append((formatted, context_score, i, line))
    
    # Pick best CNIC candidate (highest context score, or first if tied)
    if cnic_candidates:
        cnic_candidates.sort(key=lambda x: (-x[1], x[2]))
        cnic_data['cnic_number'] = cnic_candidates[0][0]
        print(f"[DEBUG] CNIC candidates found: {len(cnic_candidates)}")
        for cand in cnic_candidates:
            print(f"  - {cand[0]} (score: {cand[1]}, line {cand[2]}): {cand[3][:50]}")
    
    # Extract all dates (format: DD.MM.YYYY)
    date_pattern = r'\b(\d{2})\.(\d{2})\.(\d{4})\b'
    dates = []
    for line in lines:
        matches = re.findall(date_pattern, line)
        for match in matches:
            dates.append(f"{match[0]}.{match[1]}.{match[2]}")
    
    if len(dates) >= 1:
        cnic_data['date_of_birth'] = dates[0]
    if len(dates) >= 2:
        cnic_data['date_of_issue'] = dates[1]
    if len(dates) >= 3:
        cnic_data['date_of_expiry'] = dates[2]
    
    # Extract Name - look for "Name" then take next non-empty line
    for i, line in enumerate(lines):
        if re.search(r'\bname\b', line, re.IGNORECASE) and 'father' not in line.lower():
            # Get next few lines
            for j in range(i+1, min(i+4, len(lines))):
                potential = lines[j].strip()
                # Must have letters, be reasonable length, no CNIC pattern
                if potential and len(potential) > 3 and not re.search(r'\d{5}', potential):
                    # Clean but keep the content
                    cnic_data['name'] = ' '.join(potential.split())
                    break
            break
    
    # Extract Father Name - line after name
    if cnic_data['name']:
        for i, line in enumerate(lines):
            if cnic_data['name'] in line and i+1 < len(lines):
                potential = lines[i+1].strip()
                if potential and len(potential) > 3 and not re.search(r'\d{5}', potential):
                    cnic_data['father_name'] = ' '.join(potential.split())
                break
    
    # Extract Gender - look for M/F or Male/Female
    for line in lines:
        line_upper = line.upper().strip()
        # More precise matching
        if line_upper == 'M' or (re.search(r'\bMALE\b', line_upper) and 'FEMALE' not in line_upper):
            cnic_data['gender'] = 'Male'
            break
        elif line_upper == 'F' or re.search(r'\bFEMALE\b', line_upper):
            cnic_data['gender'] = 'Female'
            break
    
    # Extract Country
    if 'pakistan' in text.lower():
        cnic_data['country'] = 'Pakistan'
    
    # Validate CNIC
    cnic_data['is_valid_cnic'] = validate_cnic(cnic_data)
    
    return cnic_data

def validate_cnic(cnic_data):
    """Validate if the document is a genuine CNIC"""
    validation_checks = {
        'has_cnic_number': bool(cnic_data['cnic_number']),
        'has_valid_cnic_format': False,
        'has_name': bool(cnic_data['name']),
        'has_dob': bool(cnic_data['date_of_birth']),
        'has_pakistan_text': bool(cnic_data['country']),
        'has_issue_date': bool(cnic_data['date_of_issue']),
        'has_expiry_date': bool(cnic_data['date_of_expiry'])
    }
    
    # Validate CNIC format
    if cnic_data['cnic_number']:
        cnic_clean = cnic_data['cnic_number'].replace('-', '').replace(' ', '')
        if len(cnic_clean) == 13 and cnic_clean.isdigit():
            validation_checks['has_valid_cnic_format'] = True
    
    # Calculate validation score
    passed_checks = sum(validation_checks.values())
    total_checks = len(validation_checks)
    
    print(f"\n{'='*60}")
    print("VALIDATION CHECKS:")
    print(f"{'='*60}")
    for check, result in validation_checks.items():
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status} - {check.replace('_', ' ').title()}")
    print(f"{'='*60}")
    print(f"Score: {passed_checks}/{total_checks}")
    print(f"{'='*60}")
    
    # CNIC is valid if at least 5 out of 7 checks pass
    return passed_checks >= 5

def print_cnic_details(cnic_data):
    """Print extracted CNIC details in a formatted way"""
    print(f"\n{'='*60}")
    print("EXTRACTED CNIC DETAILS:")
    print(f"{'='*60}")
    print(f"Name:              {cnic_data['name'] or 'Not Found'}")
    print(f"Father Name:       {cnic_data['father_name'] or 'Not Found'}")
    print(f"CNIC Number:       {cnic_data['cnic_number'] or 'Not Found'}")
    print(f"Date of Birth:     {cnic_data['date_of_birth'] or 'Not Found'}")
    print(f"Gender:            {cnic_data['gender'] or 'Not Found'}")
    print(f"Country:           {cnic_data['country'] or 'Not Found'}")
    print(f"Date of Issue:     {cnic_data['date_of_issue'] or 'Not Found'}")
    print(f"Date of Expiry:    {cnic_data['date_of_expiry'] or 'Not Found'}")
    print(f"{'='*60}")
    
    if cnic_data['is_valid_cnic']:
        print("✓ VERIFIED: This appears to be a valid Pakistani CNIC")
    else:
        print("✗ INVALID: This does not appear to be a valid CNIC")
    print(f"{'='*60}\n")

def main():
    image_path = 'test_images/1.jpg'
    
    try:
        # Extract CNIC data
        cnic_data = extract_cnic_data(image_path)
        
        # Print extracted details
        print_cnic_details(cnic_data)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
