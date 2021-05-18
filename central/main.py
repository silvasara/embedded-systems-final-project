from broker import connect_mqtt

client = connect_mqtt()
client.loop_forever()
