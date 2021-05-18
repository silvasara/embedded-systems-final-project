devices = dict()


def init_device(mac):
    if mac in devices:
        print('Device already initialized')
        return None

    return mac


def create_device(body):
    keys = ['mac', 'room', 'temperature', 'humidity']
    if not validate_keys(body, keys):
        print('Error when creating device: invalid body')
        return None

    if body['mac'] in devices:
        print('Error: device already exists')
        return None

    devices[body['mac']] = body

    return body


def update_device(body):
    keys = ['mac', 'action', 'command']
    if not validate_keys(body, keys):
        print('Error when updating device: invalid body')
        return None

    mac = body['mac']
    action = body['action']

    if mac not in devices:
        print('Error: device is only kept in memory!')
        return None

    print('Command received: ', body['command'])  # isso aqui vai pro log

    if action == 'alarm':
        devices[mac]['alarmPressed'] = not devices[mac]['alarmPressed']
    elif action == 'led':
        devices[mac]['outDevicePressed'] = not devices[mac]['outDevicePressed']

    return devices[mac]


def validate_keys(body, keys):
    if not all(k in body for k in keys):
        return False

    return True
