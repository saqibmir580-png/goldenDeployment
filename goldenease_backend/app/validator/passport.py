# app/validator/passport.py
import re
from datetime import datetime, timedelta

def extract_passport_data(text):
    # Regex examples - adapt to your passport format/language
    doc_num_match = re.search(r"Passport No[:\s]*([A-Z0-9]+)", text, re.IGNORECASE)
    holder_name_match = re.search(r"Name[:\s]*([A-Za-z\s]+)", text, re.IGNORECASE)
    issued_date_match = re.search(r"Issued Date[:\s]*([\d/-]+)", text, re.IGNORECASE)
    expiry_date_match = re.search(r"Expiry Date[:\s]*([\d/-]+)", text, re.IGNORECASE)
    issuer_match = re.search(r"Issuer[:\s]*([\w\s]+)", text, re.IGNORECASE)
    nationality_match = re.search(r"Nationality[:\s]*([\w\s]+)", text, re.IGNORECASE)

    data = {
        "document_number": doc_num_match.group(1).strip() if doc_num_match else None,
        "holder_name": holder_name_match.group(1).strip() if holder_name_match else None,
        "issued_date": issued_date_match.group(1).strip() if issued_date_match else None,
        "expiry_date": expiry_date_match.group(1).strip() if expiry_date_match else None,
        "issuer": issuer_match.group(1).strip() if issuer_match else None,
        "nationality": nationality_match.group(1).strip() if nationality_match else None,
    }
    return data

def validate_passport_expiry(expiry_date_str):
    if not expiry_date_str:
        return {"is_valid": False, "message": "Could not detect expiry date."}

    for fmt in ("%d-%m-%Y", "%d/%m/%Y", "%Y-%m-%d", "%Y/%m/%d"):
        try:
            expiry = datetime.strptime(expiry_date_str, fmt)
            break
        except ValueError:
            continue
    else:
        return {"is_valid": False, "message": "Invalid expiry date format."}

    if expiry > datetime.now() + timedelta(days=180):
        return {"is_valid": True, "expiry_date": expiry.strftime("%Y-%m-%d"), "message": "Passport is valid for more than 6 months."}
    else:
        return {"is_valid": False, "expiry_date": expiry.strftime("%Y-%m-%d"), "message": "Passport expiry is within 6 months."}
