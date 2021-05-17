import json

from broker import (
    client,
    subscribe,
    publish
)


client.loop_start()
#subscribe(client, "fse2020/160144752/room/temperatura")
#subscribe(client, "fse2020/160144752/room/umidade")
subscribe(client, "fse2020/160144752/dispositivos/#")
publish(
    client,
    "fse2020/160144752/dispositivos/1", #substituir pelo mac
    json.dumps({"comodo": "sala"})
)
