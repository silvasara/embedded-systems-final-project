#ifndef MQTT_H
#define MQTT_H

char room_name[100];
void mqtt_start();
void mqtt_send_message(char *topic, char *message);
void get_mac(char *mac);

#endif
