from utils import validate_keys
from handlers import devices


def create_device(body):
    keys = ['mac', 'room', 'temperature', 'humidity']
    if not validate_keys(body, keys):
        print('Error when creating device: invalid body')
        return None

    mac = body['mac']
    if mac in devices:
        print('Error: device already exists')
        return None

    devices[mac] = body
    print(f'Device {mac} added')
    return body


def delete_device(body):
    mac = body['mac']
    if mac in devices:
        del devices[mac]
        print(f'Device {mac} deleted')
        return True

    return False


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

    # response = {
    #     'action': action
    # }
    return devices[mac]
