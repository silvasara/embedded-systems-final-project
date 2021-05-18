#ifndef REGISTRATION_H
#define REGISTRATION_H

#include <string.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "esp_log.h"
#include "nvs_flash.h"

#define REGISTRATION_PARTITION "registration"
#define ROOM_NVS_KEY "room"

void update_registered_rooms(char *room_name, char *data);
void write_nvs(char *room_name);
int32_t read_nvs(char *room_name);

#endif
