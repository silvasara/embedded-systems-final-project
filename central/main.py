import json

from broker import (
    client,
    subscribe,
    publish
)


client.loop_start()
subscribe(client, "fse2020/160144752/room/temperatura")
subscribe(client, "fse2020/160144752/room/umidade")
publish(
    client,
    "fse2020/160144752/dispositivos/1",
    json.dumps({"temperatura": 23})
)
