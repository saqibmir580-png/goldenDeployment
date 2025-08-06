def validate_marriage_certificate(data):
    if not data.get("document_number"):
        return {"is_valid": False, "message": "Certificate number missing"}

    if not data.get("bride_name") or not data.get("groom_name"):
        return {"is_valid": False, "message": "Bride or groom name missing"}

    # Marriage date could be optional or you can add date validation if needed

    return {"is_valid": True, "message": "Marriage certificate looks valid"}
