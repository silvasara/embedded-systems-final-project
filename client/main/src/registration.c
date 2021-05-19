#include "registration.h"

int32_t read_nvs(char *room_name){
    ESP_ERROR_CHECK(nvs_flash_init_partition(REGISTRATION_PARTITION));

    nvs_handle partition_handle;

    esp_err_t read_status = nvs_open(REGISTRATION_PARTITION, NVS_READONLY, &partition_handle);

    if(read_status != ESP_OK && read_status != ESP_ERR_NVS_NOT_FOUND) {
        ESP_ERROR_CHECK(read_status);
    }

    size_t required_size;
    nvs_get_str(partition_handle, ROOM_NVS_KEY, NULL, &required_size);

    char *name = calloc(required_size, sizeof(char));
    read_status = nvs_get_str(partition_handle, ROOM_NVS_KEY, name, &required_size);

    if (read_status == ESP_OK){
        printf("################\n");
        strcpy(room_name, name);
    }

    nvs_close(partition_handle);

    return read_status;
}

void write_nvs(char *room_name){
    ESP_ERROR_CHECK(nvs_flash_init_partition(REGISTRATION_PARTITION));

    nvs_handle partition_handle;

    ESP_ERROR_CHECK(nvs_open(REGISTRATION_PARTITION, NVS_READWRITE, &partition_handle));

    ESP_ERROR_CHECK(nvs_set_str(partition_handle, ROOM_NVS_KEY, room_name));

    nvs_commit(partition_handle);
    nvs_close(partition_handle);
}


void update_registered_rooms(char *room_name, char *data){
    esp_err_t read_status = read_nvs(room_name);

    if(read_status == ESP_OK){ 
        ESP_LOGI("NVS", "Device already registered to room %s", room_name);
    }
    else{
        ESP_LOGI("NVS", "Device not registered, registering...");
        strcpy(room_name, data);
        write_nvs(room_name);
        ESP_LOGI("NVS", "Device registered: %s", room_name);
    }
}

