from app.ocr.passport import extract_passport_fields
from app.ocr.emirates_id import extract_emirates_id_fields
from app.ocr.marriage_certificate import extract_marriage_certificate_fields
from app.ocr.property_ownership import extract_property_document_fields

def extract_fields_for(doc_type: str, text: str) -> dict:
    if doc_type == "passport":
        return extract_passport_fields(text)
    elif doc_type == "emirates_id":
        return extract_emirates_id_fields(text)
    elif doc_type == "marriage_certificate":
        return extract_marriage_certificate_fields(text)
    elif doc_type == "property_document":
        return extract_property_document_fields(text)
    else:
        return {}
