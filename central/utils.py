def validate_keys(body, keys):
    if not all(k in body for k in keys):
        return False

    return True


def build_valid_room(room):
    room = room.lower()

    vowels = [("á", "a"), ("é", "e"), ("í", "i"), ("ó", "o"), ("ú", "u")]
    for old_v, new_v in vowels:
        room = room.replace(old_v, new_v)

    room = room.replace(" ", "_")

    return room
