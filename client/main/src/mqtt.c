#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>

#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_event.h"
#include "esp_netif.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"

#include "lwip/sockets.h"
#include "lwip/dns.h"
#include "lwip/netdb.h"
#include "esp_sleep.h"

#include "esp_log.h"
#include "mqtt_client.h"

#include "mqtt.h"
#include "cJSON.h"
#include "registration.h"
#include "gpio.h"

#define TAG "MQTT"

#ifndef CONFIG_LOW_POWER
#define CONFIG_LOW_POWER 0
#endif
#define LOW_POWER CONFIG_LOW_POWER

extern xSemaphoreHandle conn_mqtt_semaphore;

esp_mqtt_client_handle_t client;

static void log_error_if_nonzero(const char *message, int error_code)
{
    if (error_code != 0) {
        ESP_LOGE(TAG, "Last error %s: 0x%x", message, error_code);
    }
}

char topic_room[200];

static esp_err_t mqtt_event_handler_cb(esp_mqtt_event_handle_t event){

    char mac[18];
    get_mac((char *) mac);
    char topic[100];

    sprintf(topic, "fse2020/160144752/dispositivos/%s", mac);

    switch (event->event_id) {
        case MQTT_EVENT_CONNECTED:
            ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");


            char msg[50];
            sprintf(msg, "%s", mac);

            mqtt_send_message(topic, msg);
            vTaskDelay(1000 / portTICK_PERIOD_MS);
            esp_mqtt_client_subscribe(client, topic, 0);

            break;

        case MQTT_EVENT_DISCONNECTED:
            ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
            break;

        case MQTT_EVENT_SUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_UNSUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_PUBLISHED:
            ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_DATA:
            ESP_LOGI(TAG, "MQTT_EVENT_DATA");
            printf("TOPIC=%.*s\r\n", event->topic_len, event->topic);
            printf("DATA=%.*s\r\n", event->data_len, event->data);
            
            char event_topic[200];
            memcpy(event_topic, event->topic, event->topic_len);
            event_topic[event->topic_len] = 0; 
            
            if (strcmp(event_topic, topic) == 0){
                cJSON *data_json = cJSON_Parse(event->data);
                const cJSON *name = NULL;

                name = cJSON_GetObjectItemCaseSensitive(data_json, "content");
                if (cJSON_IsString(name) && (name->valuestring != NULL)){
                    update_registered_rooms(room_name, name->valuestring);
                }
                xSemaphoreGive(conn_mqtt_semaphore);
                sprintf(topic_room, "fse2020/160144752/%s", room_name);
                
                esp_mqtt_client_subscribe(client, topic_room, 0);
            }
            
            if(!LOW_POWER){
                if (strcmp(event_topic, topic_room) == 0){
                    cJSON *data_json = cJSON_Parse(event->data);
                    const cJSON *name = NULL;

                    name = cJSON_GetObjectItemCaseSensitive(data_json, "action");
                    if (cJSON_IsString(name) && (name->valuestring != NULL)){
                        if(strcmp(name->valuestring, "led") == 0){
                            _toggle_led();
                        }
                        if(strcmp(name->valuestring, "reset") == 0){
                            ESP_ERROR_CHECK(nvs_flash_erase());

                            sprintf(msg, "%s", "{delete: true}");
                            mqtt_send_message(topic, msg);

                            esp_restart();
                        }
                    }
                }
            }
            break;
        case MQTT_EVENT_ERROR:
            ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
            if (event->error_handle->error_type == MQTT_ERROR_TYPE_TCP_TRANSPORT) {
                log_error_if_nonzero("reported from esp-tls", event->error_handle->esp_tls_last_esp_err);
                log_error_if_nonzero("reported from tls stack", event->error_handle->esp_tls_stack_err);
                log_error_if_nonzero("captured as transport's socket errno",  event->error_handle->esp_transport_sock_errno);
                ESP_LOGI(TAG, "Last errno string (%s)", strerror(event->error_handle->esp_transport_sock_errno));

            }
            break;
        default:
            ESP_LOGI(TAG, "Other event id:%d", event->event_id);
            break;
    }

    return ESP_OK;

}

static void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data){
    ESP_LOGD(TAG, "Event dispatched from event loop base=%s, event_id=%d", base, event_id);

    mqtt_event_handler_cb(event_data);
}

void mqtt_start(){
    esp_mqtt_client_config_t mqtt_cfg = {
        .uri = "mqtt://mqtt.eclipseprojects.io",
    };

    client = esp_mqtt_client_init(&mqtt_cfg);
    esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, client);
    esp_mqtt_client_start(client);
}

void mqtt_send_message(char *topic, char *message){
    char *payload = NULL;

    cJSON *json = cJSON_CreateObject();

    if (cJSON_AddStringToObject(json, "content", message) == NULL)
        goto end;

    payload = cJSON_Print(json);

    int message_id = esp_mqtt_client_publish(client, topic, payload, 0, 1, 0);
    ESP_LOGI(TAG, "Message sent, ID: %d", message_id);
    return;

end:
    ESP_LOGI(TAG, "Error creating JSON object!");
    cJSON_Delete(json);
    return;
}

void get_mac(char *mac){
    uint8_t mac_arr[6];

    ESP_ERROR_CHECK(esp_read_mac(mac_arr, ESP_MAC_WIFI_STA));

    sprintf(mac, "%02X:%02X:%02X:%02X:%02X:%02X", mac_arr[0], mac_arr[1], mac_arr[2], mac_arr[3], mac_arr[4], mac_arr[5]);
}
