from handlers import devices


def init_device(mac):
    if mac in devices:
        print('Device already initialized')
        return None

    return mac
