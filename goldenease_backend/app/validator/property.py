def validate_property_document(data):
    if not data.get("document_number"):
        return {"is_valid": False, "message": "Property document number missing"}

    if not data.get("owner_name"):
        return {"is_valid": False, "message": "Owner name missing"}

    # Registration date could be validated if needed

    return {"is_valid": True, "message": "Property document looks valid"}
