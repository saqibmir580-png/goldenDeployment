import re

def extract_passport_fields(text: str):
    data = {}
    original_text = text
    text = text.replace('\n', ' ').replace('\r', '').strip()
    
    # Debug: Print the text being processed (first 200 chars)
    print(f"DEBUG - Processing passport text: {text[:200]}...")
    
    # More flexible passport number patterns
    patterns = [
        r"Passport\s*(?:No|Number)?[:\s]*([A-Z0-9]{6,15})",
        r"Document\s*(?:No|Number)[:\s]*([A-Z0-9]{6,15})",
        r"P<[A-Z]{3}([A-Z0-9]{9})",  # Machine readable zone
        r"([A-Z]{1,2}\d{6,8})",  # Common passport formats
        r"\b([A-Z]\d{7,8})\b",  # Letter followed by 7-8 digits
        r"\b([A-Z]{2}\d{6,7})\b",  # Two letters followed by 6-7 digits
        r"No[.:]?\s*([A-Z0-9]{6,12})",  # "No:" or "No." followed by alphanumeric
        r"([A-Z0-9]{8,12})(?=\s|$)",  # 8-12 character alphanumeric sequences
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            # Filter out common false positives
            for match in matches:
                if len(match) >= 6 and not match.isdigit():  # Not just numbers
                    data["document_number"] = match
                    break
            if "document_number" in data:
                break
    
    # More flexible name patterns
    name_patterns = [
        r"(?:Name|Holder|Given\s*Names?)[:\s]*([A-Z][A-Z\s]{2,40})",
        r"Surname[:\s]*([A-Z][A-Z\s]{2,40})",
        r"([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})?)",  # Two or more capitalized words
    ]
    
    for pattern in name_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["holder_name"] = match.group(1).strip()
            break
    
    # More flexible date patterns for issue date
    date_patterns = [
        r"Issue(?:d)?\s*(?:Date|On)[:\s]*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})",
        r"Date\s*of\s*Issue[:\s]*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})",
        r"(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})\s*Issue",
        r"Issued[:\s]*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})",
        r"Issue[:\s]*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})",
    ]
    
    # Find all dates first
    all_dates = re.findall(r"\b(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})\b", text)
    print(f"DEBUG - Found dates in text: {all_dates}")
    
    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["issued_date"] = match.group(1)
            break
    
    # More flexible expiry date patterns
    expiry_patterns = [
        r"Expir(?:y|es?)\s*(?:Date|On)[:\s]*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})",
        r"Valid\s*(?:Until|Till)[:\s]*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})",
        r"Date\s*of\s*Expiry[:\s]*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})",
        r"Expires?[:\s]*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})",
        r"Valid\s*(?:to|until)[:\s]*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})",
        r"(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})\s*(?:Expir|Valid)",
    ]
    
    for pattern in expiry_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            data["expiry_date"] = matches[-1]  # Take the last match
            break
    
    # If no specific expiry pattern found, try to infer from all dates
    if "expiry_date" not in data and all_dates:
        # Usually expiry date is later than issue date
        # If we have multiple dates, take the later one as expiry
        if len(all_dates) >= 2:
            try:
                from datetime import datetime
                parsed_dates = []
                for date_str in all_dates:
                    for fmt in ["%d/%m/%Y", "%d-%m-%Y", "%d.%m.%Y", "%m/%d/%Y", "%m-%d-%Y"]:
                        try:
                            parsed_dates.append((datetime.strptime(date_str, fmt), date_str))
                            break
                        except ValueError:
                            continue
                
                if len(parsed_dates) >= 2:
                    # Sort by date and take the latest as expiry
                    parsed_dates.sort(key=lambda x: x[0])
                    data["expiry_date"] = parsed_dates[-1][1]
                    if "issued_date" not in data:
                        data["issued_date"] = parsed_dates[0][1]
            except Exception as e:
                print(f"DEBUG - Date parsing error: {e}")
    
    # More flexible nationality patterns
    nationality_patterns = [
        r"Nationality[:\s]*([A-Z][A-Z\s]{2,25})",
        r"Country\s*of\s*Birth[:\s]*([A-Z][A-Z\s]{2,25})",
        r"Citizen(?:ship)?[:\s]*([A-Z][A-Z\s]{2,25})",
        r"National[:\s]*([A-Z][A-Z\s]{2,25})",
        r"Country[:\s]*([A-Z][A-Z\s]{2,25})",
        # Common country codes and names
        r"\b(UNITED STATES|USA|AMERICAN|BRITISH|CANADIAN|AUSTRALIAN|INDIAN|PAKISTANI|BANGLADESHI|NIGERIAN|SOUTH AFRICAN)\b",
        r"\b([A-Z]{2,}IAN|[A-Z]{2,}ESE|[A-Z]{2,}ISH)\b",  # Common nationality suffixes
    ]
    
    for pattern in nationality_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            nationality = match.group(1).strip()
            # Clean up common OCR errors
            nationality = re.sub(r'[^A-Za-z\s]', '', nationality).strip()
            if len(nationality) > 2:
                data["nationality"] = nationality
                break
    
    # More flexible issuer patterns
    issuer_patterns = [
        r"Issuing\s*(?:Country|Authority)[:\s]*([A-Z][A-Z\s]{2,25})",
        r"Issued\s*by[:\s]*([A-Z][A-Z\s]{2,25})",
        r"Authority[:\s]*([A-Z][A-Z\s]{2,25})",
        r"Government\s*of[:\s]*([A-Z][A-Z\s]{2,25})",
        r"Republic\s*of[:\s]*([A-Z][A-Z\s]{2,25})",
        r"Kingdom\s*of[:\s]*([A-Z][A-Z\s]{2,25})",
        # Common issuing authorities
        r"\b(UNITED STATES|USA|UNITED KINGDOM|UK|CANADA|AUSTRALIA|INDIA|PAKISTAN|BANGLADESH|NIGERIA|SOUTH AFRICA)\b",
    ]
    
    for pattern in issuer_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            issuer = match.group(1).strip()
            # Clean up common OCR errors
            issuer = re.sub(r'[^A-Za-z\s]', '', issuer).strip()
            if len(issuer) > 2:
                data["issuer"] = issuer
                break
    
    return data
