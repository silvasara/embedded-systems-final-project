import json
import time

from broker import (
    client,
    subscribe,
    publish
)

client.loop_start()
publish(
    client,
    "fse2020/160144752/dispositivos/24:62:AB:E1:9B:3C",
    json.dumps({"content": "room"})
)

while True:
    subscribe(client, "fse2020/160144752/room/temperatura")
    subscribe(client, "fse2020/160144752/room/umidade")
    subscribe(client, "fse2020/160144752/dispositivos/#")
    subscribe(client, "fse2020/160144752/room/estado")
    publish(
        client,
        "fse2020/160144752/room",
        json.dumps({"action": "led"})
    )
    time.sleep(2)
