import controller
import constants
import json
from paho.mqtt import client as mqtt_client


broker = 'mqtt.eclipseprojects.io'


def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")

            # subscribe(client, "fse2020/160144752/room/temperatura")
            # subscribe(client, "fse2020/160144752/room/umidade")
            subscribe(client, constants.DEVICES_TOPIC)
            # subscribe(client, "fse2020/160144752/room/estado")
            subscribe(client, constants.CREATE_TOPIC)
            subscribe(client, constants.UPDATE_TOPIC)
            subscribe(client, constants.DELETE_TOPIC)
        else:
            print("Failed to connect, return code %d\n", rc)

    def on_disconnect(client, userdata, rc):
        print("Disconnected from MQTT Broker!")
        print("Return code: ", rc)

    client = mqtt_client.Client(client_id="fse-top-pyclientv1.0.0")
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.connect(broker, 1883, 60)
    return client


def subscribe(client: mqtt_client, topic):
    def on_message(client, userdata, msg):
        print(f"Received new message from `{msg.topic}` topic")
        data = json.loads(msg.payload)

        if 'dispositivos' in msg.topic:
            mac = msg.topic.split('/')[-1]
            device = controller.init_device(mac)
            if device:
                publish(
                    client,
                    constants.FRONT_TOPIC_MAC,
                    json.dumps({'mac': mac})
                )

        elif msg.topic == constants.CREATE_TOPIC:
            device = controller.create_device(data)
            if device:
                # publish(client, constants.)
                ...
        elif msg.topic == constants.UPDATE_TOPIC:
            controller.update_device(data)

    client.subscribe(topic)
    client.on_message = on_message


def publish(client, topic, msg):
    result = client.publish(topic, msg)
    status = result[0]
    if status == 0:
        print(f"Send msg to topic `{topic}`")
    else:
        print(f"Failed to send message to topic {topic}")
