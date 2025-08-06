import re

def extract_emirates_id_fields(text: str):
    data = {}
    original_text = text
    text = text.replace('\n', ' ').replace('\t', ' ')
    
    # Debug logging
    print(f"\n=== EMIRATES ID OCR DEBUG ===")
    print(f"Original text length: {len(original_text)}")
    print(f"Processed text (first 500 chars): {text[:500]}")
    print(f"Full processed text: {text}")
    
    # More flexible patterns for Emirates ID number
    id_patterns = [
        r"\b784-\d{4}-\d{7}-\d{1}\b",  # Standard format
        r"\b784\s*-?\s*\d{4}\s*-?\s*\d{7}\s*-?\s*\d{1}\b",  # With spaces
        r"\b784\d{12}\b",  # Without dashes
        r"ID\s*(?:No|Number)[:\s]*([0-9\-\s]{15,20})",
        r"Emirates\s*ID[:\s]*([0-9\-\s]{15,20})",
        r"([0-9\-\s]{15,20})"  # Any long number sequence
    ]
    
    for pattern in id_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted = match.group(1) if match.lastindex else match.group()
            # Clean up the extracted ID
            cleaned_id = re.sub(r'[^0-9\-]', '', extracted)
            if len(cleaned_id) >= 12:  # Minimum length check
                data["document_number"] = cleaned_id
                print(f"Document number found with pattern '{pattern}': {data['document_number']}")
                break
    
    # More flexible patterns for holder name
    name_patterns = [
        r"Name[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Full\s*Name[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Holder[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+){2,})"  # 3+ capitalized words
    ]
    
    for pattern in name_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["holder_name"] = match.group(1).strip()
            print(f"Holder name found with pattern '{pattern}': {data['holder_name']}")
            break
    
    # More flexible date patterns
    date_patterns = [
        r"(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{4})",
        r"(\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2})",
        r"(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})",
        r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2},?\s+\d{4})"
    ]
    
    # Date of birth patterns
    dob_patterns = [
        r"DOB[:\s]*" + pattern for pattern in date_patterns
    ] + [
        r"Date\s*of\s*Birth[:\s]*" + pattern for pattern in date_patterns
    ] + [
        r"Born[:\s]*" + pattern for pattern in date_patterns
    ]
    
    for pattern in dob_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["date_of_birth"] = match.group(1).strip()
            print(f"Date of birth found with pattern '{pattern}': {data['date_of_birth']}")
            break
    
    # Expiry date patterns
    expiry_patterns = [
        r"Expiry\s*Date[:\s]*" + pattern for pattern in date_patterns
    ] + [
        r"Expires[:\s]*" + pattern for pattern in date_patterns
    ] + [
        r"Valid\s*Until[:\s]*" + pattern for pattern in date_patterns
    ]
    
    for pattern in expiry_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["expiry_date"] = match.group(1).strip()
            print(f"Expiry date found with pattern '{pattern}': {data['expiry_date']}")
            break
    
    # Nationality patterns
    nationality_patterns = [
        r"Nationality[:\s]*([A-Z][a-z]+)",
        r"Citizen\s*of[:\s]*([A-Z][a-z]+)",
        r"Country[:\s]*([A-Z][a-z]+)",
        r"([A-Z][a-z]+)\s*(?:Citizen|National)"
    ]
    
    for pattern in nationality_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            nationality = match.group(1).strip()
            # Filter out common false positives
            if nationality.lower() not in ['sex', 'male', 'female', 'date', 'birth', 'issue', 'expiry']:
                data["nationality"] = nationality
                print(f"Nationality found with pattern '{pattern}': {data['nationality']}")
                break
    
    print(f"Final extracted data: {data}")
    print(f"=== END EMIRATES ID OCR DEBUG ===\n")
    
    return data
