import re

def extract_marriage_certificate_fields(text: str):
    data = {}
    original_text = text
    text = text.replace('\n', ' ').replace('\t', ' ')
    
    # Debug logging
    print(f"\n=== MARRIAGE CERTIFICATE OCR DEBUG ===")
    print(f"Original text length: {len(original_text)}")
    print(f"Processed text (first 500 chars): {text[:500]}")
    print(f"Full processed text: {text}")
    
    # More flexible patterns for document number
    patterns = [
        r"Certificate\s*(?:No|Number|#)[:\s]*([A-Z0-9\-\/]+)",
        r"Cert\s*(?:No|Number|#)[:\s]*([A-Z0-9\-\/]+)",
        r"Registration\s*(?:No|Number|#)[:\s]*([A-Z0-9\-\/]+)",
        r"(?:No|Number|#)[:\s]*([A-Z0-9\-\/]{3,})",
        r"([A-Z0-9\-\/]{5,})"  # Any alphanumeric sequence 5+ chars
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["document_number"] = match.group(1).strip()
            print(f"Document number found with pattern '{pattern}': {data['document_number']}")
            break
    
    # More flexible patterns for bride name
    bride_patterns = [
        r"Bride[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Wife[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Female[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"(?:Name\s*of\s*)?Bride[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*(?:and|&)"
    ]
    
    for pattern in bride_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["bride_name"] = match.group(1).strip()
            print(f"Bride name found with pattern '{pattern}': {data['bride_name']}")
            break
    
    # More flexible patterns for groom name
    groom_patterns = [
        r"Groom[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Husband[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Male[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"(?:Name\s*of\s*)?Groom[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"(?:and|&)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)"
    ]
    
    for pattern in groom_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["groom_name"] = match.group(1).strip()
            print(f"Groom name found with pattern '{pattern}': {data['groom_name']}")
            break
    
    # More flexible date patterns
    date_patterns = [
        r"(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{4})",
        r"(\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2})",
        r"(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})",
        r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2},?\s+\d{4})"
    ]
    
    # Marriage date patterns
    marriage_date_patterns = [
        r"Marriage\s*Date[:\s]*" + pattern for pattern in date_patterns
    ] + [
        r"Date\s*of\s*Marriage[:\s]*" + pattern for pattern in date_patterns
    ] + [
        r"Married\s*on[:\s]*" + pattern for pattern in date_patterns
    ]
    
    for pattern in marriage_date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["marriage_date"] = match.group(1).strip()
            print(f"Marriage date found with pattern '{pattern}': {data['marriage_date']}")
            break
    
    # If no specific marriage date found, try to find any date
    if "marriage_date" not in data:
        for pattern in date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                data["marriage_date"] = matches[0].strip()
                print(f"Marriage date found (generic): {data['marriage_date']}")
                break
    
    # Issued date patterns
    issued_date_patterns = [
        r"Issued\s*Date[:\s]*" + pattern for pattern in date_patterns
    ] + [
        r"Date\s*of\s*Issue[:\s]*" + pattern for pattern in date_patterns
    ] + [
        r"Certificate\s*Date[:\s]*" + pattern for pattern in date_patterns
    ]
    
    for pattern in issued_date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["issued_date"] = match.group(1).strip()
            print(f"Issued date found with pattern '{pattern}': {data['issued_date']}")
            break
    
    print(f"Final extracted data: {data}")
    print(f"=== END MARRIAGE CERTIFICATE OCR DEBUG ===\n")
    
    return data
