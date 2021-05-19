from broker import connect_mqtt

devices = {}

client = connect_mqtt()
client.loop_forever()
