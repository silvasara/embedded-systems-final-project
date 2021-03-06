#include <stdio.h>
#include "nvs_flash.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "esp_sleep.h"
#include "freertos/semphr.h"
#include "driver/gpio.h"
#include "dht11.h"


#ifndef CONFIG_LOW_POWER
#define CONFIG_LOW_POWER 0
#endif

#define LOW_POWER CONFIG_LOW_POWER


#include "wifi.h"
#include "mqtt.h"
#include "gpio.h"

xSemaphoreHandle conn_wifi_semaphore;
xSemaphoreHandle conn_mqtt_semaphore;

extern char room_name[100];


void wifi_connected(void *params){
    while(true){
        if(xSemaphoreTake(conn_wifi_semaphore, portMAX_DELAY)){
            mqtt_start();
        }
    }
}

void mqtt_connected(void *params){
    char msg[50];
    struct dht11_reading environ;
    char topic[200];

    if(xSemaphoreTake(conn_mqtt_semaphore, portMAX_DELAY)){
        if(LOW_POWER){
            exit(-1);
        }

        while(true){
//            environ = DHT11_read();
//
//            if(environ.status < 0){
//                printf("Failed DHT11 reading with code %d\n", environ.status);
//                continue;
//            }
//
            //sprintf(msg, "%d", environ.temperature);
            sprintf(msg, "%d", 300);
            sprintf(topic, "fse2020/160144752/%s/temperatura", room_name);
            //mqtt_send_message(topic, msg);

            //sprintf(msg, "%d", environ.humidity);
            sprintf(msg, "%d", 2);
            sprintf(topic, "fse2020/160144752/%s/umidade", room_name);
            //mqtt_send_message(topic, msg);

            vTaskDelay(2000 / portTICK_PERIOD_MS);
        }
    }
}

void app_main(void){
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    conn_wifi_semaphore = xSemaphoreCreateBinary();
    conn_mqtt_semaphore = xSemaphoreCreateBinary();
    wifi_start();
    DHT11_init(GPIO_NUM_4);


    xTaskCreate(&wifi_connected,  "MQTT connection", 4096, NULL, 1, NULL);
    xTaskCreate(&mqtt_connected,  "Broker communication", 4096, NULL, 1, NULL);
    set_up_gpio();
}

