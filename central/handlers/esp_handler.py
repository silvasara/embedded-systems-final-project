from handlers import devices


def init_device(mac):
    if mac in devices:
        print('Device already initialized')
        return None

    return mac


def update_temperature(room, body):
    if 'temperature' not in body:
        print('Temperature not in body in update')
        return None

    device = [d for d in devices.values() if d['room'] == room]
    if not device:
        print('Device not found when updating temperature')
        return None

    device = device[0]
    device['temperature'] = body['temperature']

    response = {
        'temperature': device['temperature'],
        'mac': device['mac']
    }

    return response
