import json
import constants
from paho.mqtt import client as mqtt_client
from handlers import esp_handler, front_handler


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
    client.connect(constants.BROKER, 1883, 60)
    return client


def subscribe(client: mqtt_client, topic):
    def on_message(client, userdata, msg):
        print(f"Received new message from `{msg.topic}` topic")
        data = json.loads(msg.payload)

        # MESSAGES FROM ESP32
        if "dispositivos" in msg.topic:
            mac = msg.topic.split("/")[-1]
            device = esp_handler.init_device(mac)
            if device:
                publish(
                    client,
                    constants.FRONT_TOPIC_MAC,
                    json.dumps({"mac": mac})
                )

        elif "temperatura" in msg.topic:
            room = msg.topic.split("/")[-2]

        # MESSAGES FROM FRONTEND
        elif msg.topic == constants.CREATE_TOPIC:
            device = front_handler.create_device(data)
            if device:
                url = constants.DEVICES_TOPIC[:-1] + device["mac"]
                room = device["room"]

                subscribe(client, f"fse2020/160144752/{room}/temperatura")
                subscribe(client, f"fse2020/160144752/{room}/umidade")
                subscribe(client, f"fse2020/160144752/{room}/estado")
                publish(
                    client,
                    url,
                    json.dumps({"room": room})
                )

        elif msg.topic == constants.UPDATE_TOPIC:
            front_handler.update_device(data)

        elif msg.topic == constants.DELETE_TOPIC:
            deleted = front_handler.delete_device(data)
            if deleted:
                ...  # publish to reset esp

    client.subscribe(topic)
    client.on_message = on_message


def publish(client, topic, msg):
    result = client.publish(topic, msg)
    status = result[0]
    if status == 0:
        print(f"Sent msg to topic `{topic}`")
    else:
        print(f"Failed to send message to topic {topic}")
