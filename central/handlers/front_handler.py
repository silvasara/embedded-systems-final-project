from utils import validate_keys, build_valid_room
from handlers import devices


def set_storage(body):
    if not devices and body:
        items = body
        for item in items:
            item["room"] = build_valid_room(item["room"])
            devices[item["mac"]] = item

        print("Storage retrieved successfully: ", devices)
        return items

    return None


def create_device(body):
    keys = ["mac", "room", "temperature", "humidity"]
    if not validate_keys(body, keys):
        print("Error when creating device: invalid body")
        return None

    mac = body["mac"]
    if mac in devices:
        print("Error: device already exists")
        return None

    body["room"] = build_valid_room(body["room"])

    devices[mac] = body
    print(f"Device {mac} added")
    return body


def delete_device(body):
    mac = body["mac"]
    if mac in devices:
        room = devices[mac]["room"]
        del devices[mac]
        print(f"Device {mac} deleted")

        return room, {"action": "reset"}

    return None, None


def update_device(body):
    keys = ["mac", "action", "command"]
    if not validate_keys(body, keys):
        print("Error when updating device: invalid body")
        return None

    mac = body["mac"]
    action = body["action"]

    if mac not in devices:
        print("Error: device is only kept in memory!")
        return None, None

    print("Command received: ", body["command"])  # isso aqui vai pro log

    if action == "alarm":
        devices[mac]["alarmPressed"] = not devices[mac]["alarmPressed"]
    elif action == "led":
        devices[mac]["outDevicePressed"] = not devices[mac]["outDevicePressed"]

    return devices[mac]["room"], {"action": action}
