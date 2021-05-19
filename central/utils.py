def validate_keys(body, keys):
    if not all(k in body for k in keys):
        return False

    return True
