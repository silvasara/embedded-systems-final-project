from handlers import devices


def init_device(mac):
    if mac in devices:
        print("Device already initialized")
        return None

    return mac


def update(room, body, key=""):
    if "content" not in body:
        print(f"{key}: content not in body in update")
        return None

    device = [d for d in devices.values() if d["room"] == room]
    if not device:
        print(f"Device not found when updating {key}")
        return None

    device = device[0]
    if key == "sensor":
        device["inDevicePressed"] = not device["inDevicePressed"]
        value = device["inDevicePressed"]
    else:
        device[key] = body["content"]
        value = device[key]

    response = {
        key: value,
        "mac": device["mac"]
    }

    return response
