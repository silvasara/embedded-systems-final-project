import json
import constants
from utils import build_valid_room
from paho.mqtt import client as mqtt_client
from handlers import esp_handler, front_handler


def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
            subscribe(client, constants.STORAGE_TOPIC)
            subscribe(client, constants.DEVICES_TOPIC)
            subscribe(client, constants.CREATE_TOPIC)
            subscribe(client, constants.UPDATE_TOPIC)
            subscribe(client, constants.DELETE_TOPIC)
            publish(
                client,
                constants.FRONT_TOPIC_UPDATE,
                json.dumps({"storage": "get"})
            )
        else:
            print("Failed to connect, return code %d\n", rc)

    def on_disconnect(client, userdata, rc):
        print("Disconnected from MQTT Broker!")
        print("Return code: ", rc)

    client = mqtt_client.Client(client_id="fse-top-pyclientv1.0.1")
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.connect(constants.BROKER, 1883, 60)
    return client


def subscribe(client: mqtt_client, topic):
    def on_message(client, userdata, msg):
        KEYS = ["temperatura", "umidade", "estado"]

        print(f"Received new message from `{msg.topic}` topic")
        data = json.loads(msg.payload)

        # MESSAGES FROM ESP32
        if "dispositivos" in msg.topic:
            mac = msg.topic.split("/")[-1]

            if "delete" in data:
                esp_handler.delete_device(mac)
                publish(
                    client,
                    constants.FRONT_TOPIC_UPDATE,
                    json.dumps({"delete": "true", "mac": mac})
                )
            elif "action" in data:
                pass
            else:
                device = esp_handler.init_device(mac)
                if device:
                    publish(
                        client,
                        constants.FRONT_TOPIC_MAC,
                        json.dumps({"mac": mac})
                    )

        elif any(k in msg.topic for k in KEYS):
            if "temperatura" in msg.topic:
                key = "temperature"
            elif "umidade" in msg.topic:
                key = "humidity"
            else:
                key = "sensor"

            room = msg.topic.split("/")[-2]
            response = esp_handler.update(room, data, key)
            if response:
                publish(
                    client,
                    constants.FRONT_TOPIC_UPDATE,
                    json.dumps(response)
                )

        # MESSAGES FROM FRONTEND
        elif msg.topic == constants.STORAGE_TOPIC:
            items = front_handler.set_storage(data)
            if items:
                for item in items:
                    room = item["room"]

                    subscribe(client, f"fse2020/160144752/{room}/temperatura")
                    subscribe(client, f"fse2020/160144752/{room}/umidade")
                    subscribe(client, f"fse2020/160144752/{room}/estado")

        elif msg.topic == constants.CREATE_TOPIC:
            device = front_handler.create_device(data)
            if device:
                url = constants.DEVICES_TOPIC[:-1] + device["mac"]
                room = build_valid_room(device["room"])

                subscribe(client, f"fse2020/160144752/{room}/temperatura")
                subscribe(client, f"fse2020/160144752/{room}/umidade")
                subscribe(client, f"fse2020/160144752/{room}/estado")
                publish(
                    client,
                    url,
                    json.dumps({"room": room})
                )

        elif msg.topic == constants.UPDATE_TOPIC:
            room, response = front_handler.update_device(data)

            if response:
                url = constants.BASE_URL + room
                publish(
                    client,
                    url,
                    json.dumps(response)
                )

        elif msg.topic == constants.DELETE_TOPIC:
            room, response = front_handler.delete_device(data)
            if response:
                url = constants.BASE_URL + room
                publish(
                    client,
                    url,
                    json.dumps(response)
                )

    client.subscribe(topic)
    client.on_message = on_message


def publish(client, topic, msg):
    result = client.publish(topic, msg, qos=2)
    status = result[0]
    if status == 0:
        print(f"Sent msg to topic `{topic}`")
    else:
        print(f"Failed to send message to topic {topic}")
