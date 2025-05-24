#include <SPI.h>
#include <DMD.h>
#include <TimerOne.h>
#include "SystemFont5x7.h"
#include "Arial_black_16.h"
#include "Arial14.h"

// Display configuration
#define ROW_MODULE 24
#define COLUMN_MODULE 1
DMD p10(ROW_MODULE, COLUMN_MODULE);

// Pin definitions for sensors
const byte SW1 = 44;
const byte SW2 = 42;
const byte SW3 = 40;
const byte SW4 = 38;
const byte SW5 = 36;
const byte SW6 = 34;
const byte SW7 = 32;
const byte SW8 = 30;

// Reset button pin (add a physical reset button)
const byte RESET_PIN = 22;  // Choose an available pin

// Timing configurations
const unsigned long DEBOUNCE_DELAY = 50;     // Reduced debounce time for faster response
const unsigned long RESET_DELAY = 750;        // Reduced reset time
const unsigned long MIN_PULSE_WIDTH = 100;    // Minimum time sensor must be HIGH
const unsigned long SERIAL_UPDATE_INTERVAL = 1000; // Status update interval
const unsigned long ERROR_CHECK_INTERVAL = 5000;   // Check sensors every 5 seconds

// Sensor states and timers
struct SensorState {
    byte state;
    unsigned long lastDebounceTime;
    unsigned long lastResetTime;
    unsigned long lastHighTime;
    unsigned long count;
    bool isError;  // Track if sensor is in error state
};

SensorState sensors[8];

// System timing variables
unsigned long timePrev = 0;
unsigned long timeNew = 0;
unsigned long lastSerialUpdate = 0;
unsigned long lastErrorCheck = 0;
int productionHour = 0;
int productionDivHr = 1;
bool systemInitialized = false;

// Function prototypes
void p10scan();
void initializeSensors();
void handleSensor(int index, byte pin);
void updateDisplay();
void printStatus();
void checkSensorErrors();
void resetCounters();
bool initializeHardware();

void p10scan() {
    p10.scanDisplayBySPI();
}

bool initializeHardware() {
    // Initialize display
    Timer1.initialize(3000);
    Timer1.attachInterrupt(p10scan);
    p10.clearScreen(true);
    
    // Test display
    p10.selectFont(SystemFont5x7);
    p10.drawString(672, 0, "Testing...", 9, GRAPHICS_NORMAL);
    delay(1000);
    p10.clearScreen(true);
    
    // Initialize serial communication
    Serial.begin(9600);
    Serial.println(F("System starting..."));
    
    // Initialize reset button
    pinMode(RESET_PIN, INPUT_PULLUP);
    
    return true;  // Return false if any initialization fails
}

void setup() {
    if (!initializeHardware()) {
        // If hardware init fails, blink error pattern
        while(1) {
            p10.clearScreen(true);
            delay(500);
            p10.drawString(672, 0, "HW ERR", 6, GRAPHICS_NORMAL);
            delay(500);
        }
    }
    
    // Initialize sensor pins
    initializeSensors();
    
    // Display startup sequence
    displayStartupSequence();
    
    systemInitialized = true;
    Serial.println(F("System ready!"));
}

void initializeSensors() {
    const byte sensorPins[8] = {SW1, SW2, SW3, SW4, SW5, SW6, SW7, SW8};
    
    for (int i = 0; i < 8; i++) {
        pinMode(sensorPins[i], INPUT);
        digitalWrite(sensorPins[i], LOW);
        
        sensors[i] = {
            0,                  // state
            0,                  // lastDebounceTime
            0,                  // lastResetTime
            0,                  // lastHighTime
            0,                  // count
            false              // isError
        };
    }
}

void resetCounters() {
    for (int i = 0; i < 8; i++) {
        sensors[i].count = 0;
        sensors[i].state = 0;
        sensors[i].isError = false;
    }
    productionHour = 0;
    productionDivHr = 1;
    Serial.println(F("Counters reset"));
}

void checkSensorErrors() {
    if (timeNew - lastErrorCheck >= ERROR_CHECK_INTERVAL) {
        lastErrorCheck = timeNew;
        const byte sensorPins[8] = {SW1, SW2, SW3, SW4, SW5, SW6, SW7, SW8};
        
        for (int i = 0; i < 8; i++) {
            // Check if sensor is stuck in HIGH state
            if (digitalRead(sensorPins[i]) == HIGH && 
                timeNew - sensors[i].lastHighTime >= 5000) {
                sensors[i].isError = true;
                Serial.print(F("Warning: Sensor "));
                Serial.print(i + 1);
                Serial.println(F(" may be stuck"));
            } else {
                sensors[i].isError = false;
            }
        }
    }
}

void displayStartupSequence() {
    p10.clearScreen(true);
    p10.selectFont(Arial_Black_16);
    p10.drawString(672, 0, "  EMF", 5, GRAPHICS_NORMAL);
    delay(1500);
    
    p10.selectFont(SystemFont5x7);
    p10.clearScreen(true);
    p10.drawString(672, 0, "Engineering", 11, GRAPHICS_NORMAL);
    p10.drawString(672, 9, " Solution", 9, GRAPHICS_NORMAL);
    delay(1500);
    
    p10.clearScreen(true);
    p10.drawString(672, 9, "Counter", 7, GRAPHICS_NORMAL);
    delay(1500);
    p10.clearScreen(true);
}

void handleSensor(int index, byte pin) {
    if (sensors[index].isError) {
        return;  // Skip processing if sensor is in error state
    }
    
    timeNew = millis();
    
    if (digitalRead(pin) == HIGH) {
        if (sensors[index].state == 0 && 
            (timeNew - sensors[index].lastDebounceTime >= DEBOUNCE_DELAY)) {
            
            if (timeNew - sensors[index].lastHighTime >= MIN_PULSE_WIDTH) {
                sensors[index].count++;
                sensors[index].state = 1;
                sensors[index].lastResetTime = timeNew;
            }
        }
    } else {
        sensors[index].lastHighTime = timeNew;
        if (sensors[index].state == 1 && 
            (timeNew - sensors[index].lastResetTime >= RESET_DELAY)) {
            sensors[index].state = 0;
            sensors[index].lastDebounceTime = timeNew;
        }
    }
}

void updateDisplay() {
    p10.selectFont(SystemFont5x7);
    char buffer[32];
    
    // Show total on first line
    unsigned long totalCount = 0;
    for (int i = 0; i < 8; i++) {
        if (!sensors[i].isError) {  // Only count non-error sensors
            totalCount += sensors[i].count;
        }
    }
    
    sprintf(buffer, "Total: %lu", totalCount);
    p10.drawString(672, 0, buffer, strlen(buffer), GRAPHICS_NORMAL);
    
    // Show individual lines on second line (rotating display)
    static byte currentLine = 0;
    currentLine = (currentLine + 1) % 8;
    
    if (sensors[currentLine].isError) {
        sprintf(buffer, "L%d: ERR", currentLine + 1);
    } else {
        sprintf(buffer, "L%d: %lu", currentLine + 1, sensors[currentLine].count);
    }
    p10.drawString(672, 9, buffer, strlen(buffer), GRAPHICS_NORMAL);
}

void printStatus() {
    if (timeNew - lastSerialUpdate >= SERIAL_UPDATE_INTERVAL) {
        lastSerialUpdate = timeNew;
        
        Serial.println(F("\n=== Sensor Status ==="));
        for (int i = 0; i < 8; i++) {
            Serial.print(F("Line "));
            Serial.print(i + 1);
            Serial.print(F(": "));
            if (sensors[i].isError) {
                Serial.println(F("ERROR"));
            } else {
                Serial.println(sensors[i].count);
            }
        }
        Serial.println(F("==================\n"));
    }
}

void loop() {
    timeNew = millis();
    
    // Check reset button
    if (digitalRead(RESET_PIN) == LOW) {
        delay(50);  // Simple debounce
        if (digitalRead(RESET_PIN) == LOW) {
            resetCounters();
            while(digitalRead(RESET_PIN) == LOW);  // Wait for button release
        }
    }
    
    // Update production hour counter
    if (timeNew - timePrev >= 1000) {
        timePrev = timeNew;
        productionHour++;
        if (productionHour == 3000) {
            productionHour = 0;
            productionDivHr = 1;
        }
    }
    
    // Handle all sensors
    const byte sensorPins[8] = {SW1, SW2, SW3, SW4, SW5, SW6, SW7, SW8};
    for (int i = 0; i < 8; i++) {
        handleSensor(i, sensorPins[i]);
    }
    
    // Check for sensor errors
    checkSensorErrors();
    
    // Update display
    updateDisplay();
    
    // Print periodic status
    printStatus();
    
    // Process any incoming serial commands
    if (Serial.available() > 0) {
        char incomingValue = Serial.read();
        if (incomingValue == 'R' || incomingValue == 'r') {
            resetCounters();
        }
    }
} 