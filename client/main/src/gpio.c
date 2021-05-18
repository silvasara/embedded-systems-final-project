#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "esp_log.h"
#include "driver/gpio.h"

#include "gpio.h"

xQueueHandle interruption_queue;
int led_state = 0;

static void IRAM_ATTR _gpio_isr_handler(void *args);
void _handle_interruption(void *params);
void _toggle_led();

void set_up_gpio(){
    // PIN configuration
    gpio_pad_select_gpio(BTN);
    gpio_pad_select_gpio(LED);

    // Define PIN as output
    gpio_set_direction(LED, GPIO_MODE_OUTPUT);
    gpio_set_level(LED, led_state); // Ensure the led is off

    // Define PIN as input
    gpio_set_direction(BTN, GPIO_MODE_INPUT);

    // Configura o resistor de Pulldown para o botão (por padrão a entrada estará em Zero)
    gpio_pulldown_en(BTN);

    // Desabilita o resistor de Pull-up por segurança.
    gpio_pullup_dis(BTN);

    // Config Button to activate on rising edge
    gpio_set_intr_type(BTN, GPIO_INTR_POSEDGE);

    interruption_queue = xQueueCreate(10, sizeof(int));
    xTaskCreate(_handle_interruption, "Handle button", 2048, NULL, 1, NULL);

    gpio_install_isr_service(0);
    gpio_isr_handler_add(BTN, _gpio_isr_handler, (void *) BTN);

}

// ================================ LOCAL FUNCTIONS ================================

void _handle_interruption(void *params){
    int pin;
    int counter = 0;

    while(true) {
        if(xQueueReceive(interruption_queue, &pin, portMAX_DELAY)){
            // De-bouncing
            int state = gpio_get_level(pin);

            if(state == 1){
                gpio_isr_handler_remove(pin);
                while(gpio_get_level(pin) == state){
                    vTaskDelay(50 / portTICK_PERIOD_MS);
                }

                printf("BOTÃO PRESSIONADO %d vezes!\n", ++counter);

                // Habilitar novamente a interrupção
                vTaskDelay(50 / portTICK_PERIOD_MS);
                gpio_isr_handler_add(pin, _gpio_isr_handler, (void *) pin);
            }

        }
    }
}

static void IRAM_ATTR _gpio_isr_handler(void *args){
  int pin = (int)args;
  xQueueSendFromISR(interruption_queue, &pin, NULL);
}

void _toggle_led(){
    led_state = !led_state;
    gpio_set_level(LED, led_state);
}
