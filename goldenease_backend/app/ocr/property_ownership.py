import re

def extract_property_document_fields(text: str):
    data = {}
    original_text = text
    text = text.replace('\n', ' ').replace('\t', ' ')
    
    # Debug logging
    print(f"\n=== PROPERTY DOCUMENT OCR DEBUG ===")
    print(f"Original text length: {len(original_text)}")
    print(f"Processed text (first 500 chars): {text[:500]}")
    print(f"Full processed text: {text}")
    
    # More flexible patterns for document number
    doc_patterns = [
        r"Title\s*Deed\s*(?:No|Number|#)[:\s]*([A-Z0-9\-\/]+)",
        r"Property\s*(?:No|Number|#)[:\s]*([A-Z0-9\-\/]+)",
        r"Registration\s*(?:No|Number|#)[:\s]*([A-Z0-9\-\/]+)",
        r"Document\s*(?:No|Number|#)[:\s]*([A-Z0-9\-\/]+)",
        r"Deed\s*(?:No|Number|#)[:\s]*([A-Z0-9\-\/]+)",
        r"(?:No|Number|#)[:\s]*([A-Z0-9\-\/]{3,})",
        r"([A-Z0-9\-\/]{5,})"  # Any alphanumeric sequence 5+ chars
    ]
    
    for pattern in doc_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["document_number"] = match.group(1).strip()
            print(f"Document number found with pattern '{pattern}': {data['document_number']}")
            break
    
    # More flexible patterns for owner name
    owner_patterns = [
        r"Owner\s*Name[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Property\s*Owner[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Registered\s*Owner[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Name\s*of\s*Owner[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Holder[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+){2,})"  # 3+ capitalized words
    ]
    
    for pattern in owner_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["owner_name"] = match.group(1).strip()
            print(f"Owner name found with pattern '{pattern}': {data['owner_name']}")
            break
    
    # More flexible patterns for property type
    type_patterns = [
        r"Property\s*Type[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Type\s*of\s*Property[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Category[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"Classification[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"(?:Apartment|House|Villa|Land|Commercial|Residential|Industrial)"  # Common property types
    ]
    
    for pattern in type_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            prop_type = match.group(1) if match.lastindex else match.group()
            # Filter out common false positives
            if prop_type.lower() not in ['date', 'number', 'name', 'owner', 'registration']:
                data["property_type"] = prop_type.strip()
                print(f"Property type found with pattern '{pattern}': {data['property_type']}")
                break
    
    # More flexible date patterns
    date_patterns = [
        r"(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{4})",
        r"(\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2})",
        r"(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})",
        r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2},?\s+\d{4})"
    ]
    
    # Registration date patterns
    registration_patterns = [
        r"Registration\s*Date[:\s]*" + pattern for pattern in date_patterns
    ] + [
        r"Registered\s*on[:\s]*" + pattern for pattern in date_patterns
    ] + [
        r"Date\s*of\s*Registration[:\s]*" + pattern for pattern in date_patterns
    ] + [
        r"Issue\s*Date[:\s]*" + pattern for pattern in date_patterns
    ]
    
    for pattern in registration_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["registration_date"] = match.group(1).strip()
            print(f"Registration date found with pattern '{pattern}': {data['registration_date']}")
            break
    
    # If no specific registration date found, try to find any date
    if "registration_date" not in data:
        for pattern in date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                data["registration_date"] = matches[0].strip()
                print(f"Registration date found (generic): {data['registration_date']}")
                break
    
    print(f"Final extracted data: {data}")
    print(f"=== END PROPERTY DOCUMENT OCR DEBUG ===\n")
    
    return data
