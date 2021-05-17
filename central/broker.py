import random
import time
import json
from paho.mqtt import client as mqtt_client


broker = 'mqtt.eclipseprojects.io'


def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(transport="websockets")
    client.on_connect = on_connect
    client.connect(broker, 80, 60)
    return client


def subscribe(client: mqtt_client, topic):
    def on_message(client, userdata, msg):
        print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
        data = json.loads(msg.payload)
        print(data)

    client.subscribe(topic)
    client.on_message = on_message


def publish(client, topic, msg):
    while True:
        result = client.publish(topic, msg)
        status = result[0]
        if status == 0:
            print(f"Send msg to topic `{topic}`")
        else:
            print(f"Failed to send message to topic {topic}")
        time.sleep(2)

client = connect_mqtt()
