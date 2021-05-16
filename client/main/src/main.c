#include <stdio.h>
#include "nvs_flash.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "freertos/semphr.h"

#include "wifi.h"
#include "mqtt.h"

xSemaphoreHandle conn_wifi_semaphore;
xSemaphoreHandle conn_mqtt_semaphore;

typedef struct Environ
{
    int temp;
    int humidity;
} Environ;


Environ env;

void wifi_connected(void *params){
    while(true){
        if(xSemaphoreTake(conn_wifi_semaphore, portMAX_DELAY)){
            printf("Hello, word!\n");
            printf("temp = %d humidity = %d\n", env.temp, env.humidity);
            mqtt_start();
        }
    }
}

void mqtt_connected(void *params){
    char msg[50];

    if(xSemaphoreTake(conn_mqtt_semaphore, portMAX_DELAY)){
        while(true){
            float temp = 25.0;

            sprintf(msg, "temperature = %f", temp);
            mqtt_send_message("sensors/temperature", msg);
            vTaskDelay(2000 / portTICK_PERIOD_MS);
        }
    }
}

void app_main(void)
{
    env.temp = 25;
    env.humidity = 10;

    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
      ESP_ERROR_CHECK(nvs_flash_erase());
      ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);
    
    conn_wifi_semaphore = xSemaphoreCreateBinary();
    conn_mqtt_semaphore = xSemaphoreCreateBinary();
    wifi_start();

    xTaskCreate(&wifi_connected,  "MQTT connection", 4096, NULL, 1, NULL);
    xTaskCreate(&mqtt_connected,  "Broker communication", 4096, NULL, 1, NULL);
}

