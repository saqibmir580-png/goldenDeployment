import re
from datetime import datetime, timedelta

def validate_emirates_id(data):
    doc_num = data.get("document_number")
    expiry_date_str = data.get("expiry_date")

    if not doc_num:
        return {"is_valid": False, "message": "Emirates ID number missing"}

    if not expiry_date_str:
        return {"is_valid": False, "message": "Expiry date missing"}

    for fmt in ("%d-%m-%Y", "%d/%m/%Y", "%Y-%m-%d", "%Y/%m/%d"):
        try:
            expiry = datetime.strptime(expiry_date_str, fmt)
            break
        except ValueError:
            continue
    else:
        return {"is_valid": False, "message": "Invalid expiry date format"}

    if expiry > datetime.now() + timedelta(days=180):
        return {"is_valid": True, "expiry_date": expiry.strftime("%Y-%m-%d"), "message": "Emirates ID is valid for more than 6 months."}
    else:
        return {"is_valid": False, "expiry_date": expiry.strftime("%Y-%m-%d"), "message": "Emirates ID expiry is within 6 months."}
