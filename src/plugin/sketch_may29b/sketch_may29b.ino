#include <SPI.h>
#include <DMD.h>        
#include <TimerOne.h>
#include "SystemFont5x7.h"
#include "Arial_black_16.h"
#include "Arial14.h"
#define ROW_MODULE 24
#define COLUMN_MODULE 1

DMD p10(ROW_MODULE, COLUMN_MODULE);

byte SW1 = 44;
byte SW2 = 42;
byte SW3 = 40;
byte SW4 = 38;
byte SW5 = 36;
byte SW6 = 34;
byte SW7 = 32;
byte SW8 = 30;

unsigned long delaytime = 200;
unsigned long delaytime1;
unsigned long delaytime1a;
unsigned long delaytime2;
unsigned long delaytime2a;
unsigned long delaytime3;
unsigned long delaytime3a;
unsigned long delaytime4;
unsigned long delaytime4a;
unsigned long delaytime5;
unsigned long delaytime5a;
unsigned long delaytime6;
unsigned long delaytime6a;
unsigned long delaytime7;
unsigned long delaytime7a;
unsigned long delaytime8;
unsigned long delaytime8a;

char Incomingvalue=0;
unsigned long timeprev;
unsigned long timenew;
int r=0;
int disp_rate=0;
int h=0;
byte allrate=0;
byte allcounter=0;
int linerate=0;
int linecounter=0;
byte LineCounter=1;
byte ProductionDivHr=1;

byte S1 = 0;
byte S2 = 0;
byte S3 = 0;
byte S4 = 0;
byte S5 = 0;
byte S6 = 0;
byte S7 = 0;
byte S8 = 0;

int rateL1=0;
int rateL2=0;
int rateL3=0;
int rateL4=0;
int rateL5=0;
int rateL6=0;
int rateL7=0;
int rateL8=0;
 
int rateL1a=0;
int rateL1b=0;
int rateL1c=0;
int rateL1d=0;

int rateL2a=0;
int rateL2b=0;
int rateL2c=0;
int rateL2d=0;

int rateL3a=0;
int rateL3b=0;
int rateL3c=0;
int rateL3d=0;

int rateL4a=0;
int rateL4b=0;
int rateL4c=0;
int rateL4d=0;

int rateL5a=0;
int rateL5b=0;
int rateL5c=0;
int rateL5d=0;

int rateL6a=0;
int rateL6b=0;
int rateL6c=0;
int rateL6d=0;

int rateL7a=0;
int rateL7b=0;
int rateL7c=0;
int rateL7d=0;

int rateL8a=0;
int rateL8b=0;
int rateL8c=0;
int rateL8d=0;

int L1 = 0000;
int L2 = 0000;
int L3 = 0000;
int L4 = 0000;
int L5 = 0000;
int L6 = 0000;
int L7 = 0000;
int L8 = 0000;

int L1a=0;
int L1b=0;
int L1c=0;
int L1d=0;

int L2a=0;
int L2b=0;
int L2c=0;
int L2d=0;

int L3a=0;
int L3b=0;
int L3c=0;
int L3d=0;

int L4a=0;
int L4b=0;
int L4c=0;
int L4d=0;

int L5a=0;
int L5b=0;
int L5c=0;
int L5d=0;

int L6a=0;
int L6b=0;
int L6c=0;
int L6d=0;

int L7a=0;
int L7b=0;
int L7c=0;
int L7d=0;

int L8a=0;
int L8b=0;
int L8c=0;
int L8d=0;

int keyword=0;
int x=0;
int y=0;
int d=0;

byte line1rate=0;
byte line2rate=0;
byte line3rate=0;
byte line4rate=0;
byte line5rate=0;
byte line6rate=0;
byte line7rate=0;
byte line8rate=0;

byte line1counter=0;
byte line2counter=0;
byte line3counter=0;
byte line4counter=0;
byte line5counter=0;
byte line6counter=0;
byte line7counter=0;
byte line8counter=0;

void p10scan()
{ 
  p10.scanDisplayBySPI();
}    

void setup() {
  Timer1.initialize(3000);
  Timer1.attachInterrupt(p10scan);
  p10.clearScreen(true);
  Serial.begin(9600);
  pinMode(SW1, INPUT);
  pinMode(SW2, INPUT);
  pinMode(SW3, INPUT);
  pinMode(SW4, INPUT);
  pinMode(SW5, INPUT);
  pinMode(SW6, INPUT);
  pinMode(SW7, INPUT);
  pinMode(SW8, INPUT);

  digitalWrite(SW1, LOW);
  digitalWrite(SW2, LOW);
  digitalWrite(SW3, LOW);
  digitalWrite(SW4, LOW);
  digitalWrite(SW5, LOW);
  digitalWrite(SW6, LOW);
  digitalWrite(SW7, LOW);
  digitalWrite(SW8, LOW);

  p10.clearScreen( true );
  p10.selectFont(Arial_Black_16);  
  p10.drawString( 672,0,"  EMF",5, GRAPHICS_NORMAL );    
  delay(1500);
/* 
 while (keyword==0){
    if (Serial.available() > 0){
      Incomingvalue = Serial.read();
      if (Incomingvalue == 1){
        keyword = 1;
        }
       else{
        keyword = 0;
        }  
      }
  }
 */
  p10.selectFont(SystemFont5x7);
  p10.clearScreen( true );
  p10.drawString( 672,0,"Engineering",11, GRAPHICS_NORMAL );    
  p10.drawString( 672,9," Solution",9, GRAPHICS_NORMAL );    
  delay(1500);
  p10.clearScreen( true );
  p10.drawString( 672,9,"Counter",7, GRAPHICS_NORMAL );    
  p10.drawString( 672,9,"Counter",7, GRAPHICS_NORMAL );    
  delay(1500);
  p10.clearScreen( true );
  
}

// Add these variables to track interval-specific rates
int intervalRateL1 = 0;
int intervalRateL2 = 0;
int intervalRateL3 = 0;
int intervalRateL4 = 0;
int intervalRateL5 = 0;
int intervalRateL6 = 0;
int intervalRateL7 = 0;
int intervalRateL8 = 0;
 // Add this function after setup()
 void sendProductionData() {
   // Create JSON string with all production data
   Serial.print("Rate1: ");
   Serial.println(intervalRateL1);
   Serial.print("Rate2: ");
   Serial.println(intervalRateL2);
   Serial.print("Rate3: ");
   Serial.println(intervalRateL3);
   Serial.print("Rate4: ");
   Serial.println(intervalRateL4);
   Serial.print("Rate5: ");
   Serial.println(intervalRateL5);
   Serial.print("Rate6: ");
   Serial.println(intervalRateL6);
   Serial.print("Rate7: ");
   Serial.println(intervalRateL7);
   Serial.print("Rate8: ");
   Serial.println(intervalRateL8);
   
   // Reset interval rates after sending
   intervalRateL1 = 0;
   intervalRateL2 = 0;
   intervalRateL3 = 0;
   intervalRateL4 = 0;
   intervalRateL5 = 0;
   intervalRateL6 = 0;
   intervalRateL7 = 0;
   intervalRateL8 = 0;
}
 void sendAllActualProductionData() {

    Serial.print("Sensor 1 triggered, Total Score: ");
                Serial.println(L1);
                Serial.print("Sensor 2 triggered, Total Score: ");
                Serial.println(L2);
                Serial.print("Sensor 3 triggered, Total Score: ");
                Serial.println(L3);
                Serial.print("Sensor 4 triggered, Total Score: ");
                Serial.println(L4);
                Serial.print("Sensor 5 triggered, Total Score: ");
                Serial.println(L5);
                Serial.print("Sensor 6 triggered, Total Score: ");
                Serial.println(L6);
                Serial.print("Sensor 7 triggered, Total Score: ");
                Serial.println(L7);
                Serial.print("Sensor 8 triggered, Total Score: ");
                Serial.println(L8);
                }

// ... existing code ...
void loop() {
  timenew = millis();
  
  
//   // Send production data every 5 seconds
  static unsigned long lastSend = 0;
  if (timenew - lastSend >= 60000) {
    sendAllActualProductionData();
    lastSend = timenew;
  }
  
  if (timenew - timeprev >= 1000){
      timeprev = timenew;
      h++;
      if (h == 60){  // Changed from 3000 to 60 seconds (1 minute)
        r++;
        h = 0;
        ProductionDivHr = 1;
        sendProductionData();
       
        // sendProductionData();  // You might want to rename this to ProductionPerMin
      }
  }
// ... existing code ...

// void loop() {
//   timenew = millis();
//   if (timenew - timeprev >= 1000){
//       timeprev = timenew;
//       h++;
//       if (h==3000){
//         r++;
//         h=0;
//         ProductionDivHr=1;
//       }
//   }

  if (Serial.available() > 0){
      Incomingvalue = Serial.read();
      d=Incomingvalue;
   }

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  if(digitalRead(SW1)== HIGH){
      if (S1==0){
          if (timenew - delaytime1 >= 200){
              delaytime1 = timenew;
              L1++;
              intervalRateL1++;
              S1=1;
              LineCounter=1;

                // Serial.print("Sensor 1 triggered, Total Score: ");
                // Serial.println(L1);

          }
      }
      else{
          S1=1;
          delaytime1a = timenew;
      }
  }
  else{
     delaytime1 = timenew;
        if (S1==1){ 
              if (timenew - delaytime1a >= 1500){
                  delaytime1a = timenew;
                  S1=0;
              }
        }
  }
 
  if(digitalRead(SW2)== HIGH){
      if (S2==0){
          if (timenew - delaytime2 >= 200){
              delaytime2 = timenew;
              L2++;
              intervalRateL2++;
              S2=1;
              LineCounter=1;
            //   Serial.print("Sensor 2 triggered, Total Score: ");
            //   Serial.println(L2);
          }
      }
      else{
          S2=1;
          delaytime2a = timenew;
      }
  }
  else{
     delaytime2 = timenew;
        if (S2==1){ 
              if (timenew - delaytime2a >= 1500){
                  delaytime2a = timenew;
                  S2=0;
              }
        }
  }
  

  if(digitalRead(SW3)== HIGH){
      if (S3==0){
          if (timenew - delaytime3 >= 200){
              delaytime3 = timenew;
              L3++;
              intervalRateL3++;
              S3=1;
              LineCounter=1;
            //   Serial.print("Sensor 3 triggered, Total Score: ");
            //   Serial.println(L3);
          }
      }
      else{
          S3=1;
          delaytime3a = timenew;
      }
  }
  else{
     delaytime3 = timenew;
        if (S3==1){ 
              if (timenew - delaytime3a >= 1500){
                  delaytime3a = timenew;
                  S3=0;
              }
        }
  }
  
  if(digitalRead(SW4)== HIGH){
      if (S4==0){
          if (timenew - delaytime4 >= 200){
              delaytime4 = timenew;
              L4++;
              intervalRateL4++;
              S4=1;
              LineCounter=1;
            //   Serial.print("Sensor 4 triggered, Total Score: ");
            //   Serial.println(L4);
          }
      }
      else{
          S4=1;
          delaytime4a = timenew;
      }
  }
  else{
     delaytime4 = timenew;
        if (S4==1){ 
              if (timenew - delaytime4a >= 1500){
                  delaytime4a = timenew;
                  S4=0;
              }
        }
  }

  
  if(digitalRead(SW5)== HIGH){
      if (S5==0){
          if (timenew - delaytime5 >= 200){
              delaytime5 = timenew;
              L5++;
              intervalRateL5++;
              S5=1;
              LineCounter=1;
            //   Serial.print("Sensor 5 triggered, Total Score: ");
            //   Serial.println(L5);
          }
      }
      else{
          S5=1;
          delaytime5a = timenew;
      }
  }
  else{
     delaytime5 = timenew;
        if (S5==1){ 
              if (timenew - delaytime5a >= 1500){
                  delaytime5a = timenew;
                  S5=0;
              }
        }
  }
  
  if(digitalRead(SW6)== HIGH){
      if (S6==0){
          if (timenew - delaytime6 >= 200){
              delaytime6 = timenew;
              L6++;
              intervalRateL6++;
              S6=1;
              LineCounter=1;
            //   Serial.print("Sensor 6 triggered, Total Score: ");
            //   Serial.println(L6);
          }
      }
      else{
          S6=1;
          delaytime6a = timenew;
      }
  }
  else{
     delaytime6 = timenew;
        if (S6==1){ 
              if (timenew - delaytime6a >= 1500){
                  delaytime6a = timenew;
                  S6=0;
              }
        }
  }
  
  if(digitalRead(SW7)== HIGH){
      if (S7==0){
          if (timenew - delaytime7 >= 200){
              delaytime7 = timenew;
              L7++;
              intervalRateL7++;
              S7=1;
              LineCounter=1;
            //   Serial.print("Sensor 7 triggered, Total Score: ");
            //   Serial.println(L7);
          }
      }
      else{
          S7=1;
          delaytime7a = timenew;
      }
  }
  else{
     delaytime7 = timenew;
        if (S7==1){ 
              if (timenew - delaytime7a >= 1500){
                  delaytime7a = timenew;
                  S7=0;
              }
        }
  }
  
  if(digitalRead(SW8)== HIGH){
      if (S8==0){
          if (timenew - delaytime8 >= 200){
              delaytime8 = timenew;
              L8++;
              intervalRateL8++;
              S8=1;
              LineCounter=1;
            //   Serial.print("Sensor 8 triggered, Total Score: ");
            //   Serial.println(L8);
          }
      }
      else{
          S8=1;
          delaytime8a = timenew;
      }
  }
  else{
     delaytime8 = timenew;
        if (S8==1){ 
              if (timenew - delaytime8a >= 1500){
                  delaytime8a = timenew;
                  S8=0;
              }
        }
  }

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  switch (d){

  case 48:
    d=0;
    break;

  case 100:
    if (line1rate==1){
        rateL1++;          
        if(rateL1>9999){
           rateL1=0;         
        }
    }
    if (line2rate==1){
        rateL2++;          
        if(rateL2>9999){
           rateL2=0;         
        }
    }
    if (line3rate==1){
        rateL3++;          
        if(rateL3>9999){
           rateL3=0;         
        }
    }
    if (line4rate==1){
        rateL4++;          
        if(rateL4>9999){
           rateL4=0;         
        }
    }
    if (line5rate==1){
        rateL5++;          
        if(rateL5>9999){
           rateL5=0;         
        }
    }
    if (line6rate==1){
        rateL6++;          
        if(rateL6>9999){
           rateL6=0;         
        }
    }
    if (line7rate==1){
        rateL7++;          
        if(rateL7>9999){
           rateL7=0;         
        }
    }
    if (line8rate==1){
        rateL8++;          
        if(rateL8>9999){
           rateL8=0;         
        }
    }
    if (line8counter==1){
        L8++;          
        if(L8>9999){
           L8=0;            
        }
    }
    if (line1counter==1){
        L1++;          
        if(L1>9999){
           L1=0;            
        }
    }
    if (line2counter==1){
        L2++;          
        if(L2>9999){
           L2=0;            
        }
    }
    if (line3counter==1){
        L3++;          
        if(L3>9999){
           L3=0;            
        }
    }
    if (line4counter==1){
        L4++;          
        if(L4>9999){
           L4=0;            
        }
    }
    if (line5counter==1){
        L5++;          
        if(L5>9999){
           L5=0;            
        }
    }
    if (line6counter==1){
        L6++;          
        if(L6>9999){
           L6=0;            
        }
    }
    if (line7counter==1){
        L7++;          
        if(L7>9999){
           L7=0;            
        }
    }
    LineCounter=1;
    ProductionDivHr=1;
    d=0;
    break;

  case 104:
    if (line1rate==1){
        rateL1--;          
        if(rateL1<0){
           rateL1=0;         
        }
    }
    if (line2rate==1){
        rateL2--;          
        if(rateL2<0){
           rateL2=0;         
        }
    }
    if (line3rate==1){
        rateL3--;          
        if(rateL3<0){
           rateL3=0;         
        }
    }
    if (line4rate==1){
        rateL4--;          
        if(rateL4<0){
           rateL4=0;         
        }
    }
    if (line5rate==1){
        rateL5--;          
        if(rateL5<0){
           rateL5=0;         
        }
    }
    if (line6rate==1){
        rateL6--;          
        if(rateL6<0){
           rateL6=0;         
        }
    }
    if (line7rate==1){
        rateL7--;          
        if(rateL7<0){
           rateL7=0;         
        }
    }
    if (line8rate==1){
        rateL8--;          
        if(rateL8<0){
           rateL8=0;         
        }
    }

    if (line1counter==1){
        L1--;          
        if(L1<0){
           L1=0;            
        }
    }
    if (line2counter==1){
        L2--;          
        if(L2<0){
           L2=0;            
        }
    }
    if (line3counter==1){
        L3--;          
        if(L3<0){
           L3=0;            
        }
    }
    if (line4counter==1){
        L4--;          
        if(L4<0){
           L4=0;            
        }
    }
    if (line5counter==1){
        L5--;          
        if(L5<0){
           L5=0;            
        }
    }
    if (line6counter==1){
        L6--;          
        if(L6<0){
           L6=0;            
        }
    }
    if (line7counter==1){
        L7--;          
        if(L7<0){
           L7=0;            
        }
    }
    if (line8counter==1){
        L8--;          
        if(L8<0){
           L8=0;            
        }
    }
    LineCounter=1;
    ProductionDivHr=1;
    d=0;
    break;

  case 105:
    allrate=1;
    allcounter=0;

    line1rate=1;
    line2rate=1;
    line3rate=1;
    line4rate=1;
    line5rate=1;
    line6rate=1;
    line7rate=1;
    line8rate=1;

    line1counter=0;
    line2counter=0;
    line3counter=0;
    line4counter=0;
    line5counter=0;
    line6counter=0;
    line7counter=0;
    line8counter=0;
    d=0;
    break;

  case 106:
    linerate++;
    linecounter='0';
    if(linerate=='1'){
        p10.drawChar( 38,1,'<', GRAPHICS_NORMAL );
        p10.drawChar( 310,1,' ', GRAPHICS_NORMAL );
        line1rate=1;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
    if(linerate=='2'){
        p10.drawChar( 83,1,'<', GRAPHICS_NORMAL );
        p10.drawChar( 38,1,' ', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=1;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
    if(linerate=='3'){
        p10.drawChar( 128,1,'<', GRAPHICS_NORMAL );
        p10.drawChar( 83,1,' ', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=0;
        line3rate=1;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
    if(linerate=='4'){
        p10.drawChar( 173,1,'<', GRAPHICS_NORMAL );
        p10.drawChar( 128,1,' ', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=1;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
    if(linerate=='5'){
        p10.drawChar( 218,1,'<', GRAPHICS_NORMAL );
        p10.drawChar( 173,1,' ', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=1;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
    if(linerate=='6'){
        p10.drawChar( 263,1,'<', GRAPHICS_NORMAL );
        p10.drawChar( 218,1,' ', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=1;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
    if(linerate=='7'){
        p10.drawChar( 308,1,'<', GRAPHICS_NORMAL );
        p10.drawChar( 263,1,' ', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=1;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
    if(linerate=='8'){
        p10.drawChar( 308,1,' ', GRAPHICS_NORMAL );
        p10.drawChar( 310,1,'>', GRAPHICS_NORMAL );
        linerate='0';
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=1;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
    d=0;
    break;

  case 107:
    allrate=0;
    allcounter=1;

    line1rate=0;
    line2rate=0;
    line3rate=0;
    line4rate=0;
    line5rate=0;
    line6rate=0;
    line7rate=0;
    line8rate=0;

    line1counter=1;
    line2counter=1;
    line3counter=1;
    line4counter=1;
    line5counter=1;
    line6counter=1;
    line7counter=1;
    line8counter=1;
    d=0;
    break;

  case 108:
    linerate='0';
    linecounter++;
    if(linecounter=='1'){
        p10.drawChar( 455,1,'<', GRAPHICS_NORMAL );
        p10.drawChar( 726,1,' ', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=1;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
    if(linecounter=='2'){
        p10.drawChar( 455,1,' ', GRAPHICS_NORMAL );
        p10.drawChar( 499,1,'<', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=1;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
   if(linecounter=='3'){
        p10.drawChar( 499,1,' ', GRAPHICS_NORMAL );
        p10.drawChar( 544,1,'<', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=1;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
    if(linecounter=='4'){
        p10.drawChar( 544,1,' ', GRAPHICS_NORMAL );
        p10.drawChar( 589,1,'<', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=1;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
    if(linecounter=='5'){
        p10.drawChar( 589,1,' ', GRAPHICS_NORMAL );
        p10.drawChar( 634,1,'<', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=1;
        line6counter=0;
        line7counter=0;
        line8counter=0;
    }
    if(linecounter=='6'){
        p10.drawChar( 634,1,' ', GRAPHICS_NORMAL );
        p10.drawChar( 679,1,'<', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=1;
        line7counter=0;
        line8counter=0;
    }
    if(linecounter=='7'){
        p10.drawChar( 679,1,' ', GRAPHICS_NORMAL );
        p10.drawChar( 724,1,'<', GRAPHICS_NORMAL );
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=1;
        line8counter=0;
    }
    if(linecounter=='8'){
        p10.drawChar( 724,1,' ', GRAPHICS_NORMAL );
        p10.drawChar( 726,1,'>', GRAPHICS_NORMAL );
        linecounter='0';
        line1rate=0;
        line2rate=0;
        line3rate=0;
        line4rate=0;
        line5rate=0;
        line6rate=0;
        line7rate=0;
        line8rate=0;

        line1counter=0;
        line2counter=0;
        line3counter=0;
        line4counter=0;
        line5counter=0;
        line6counter=0;
        line7counter=0;
        line8counter=1;
    }
    d=0;
    break;

  case 109:
    p10.drawChar( 38,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 83,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 128,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 173,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 218,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 263,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 308,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 310,1,' ', GRAPHICS_NORMAL );

    p10.drawChar( 455,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 499,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 544,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 589,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 634,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 679,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 724,1,' ', GRAPHICS_NORMAL );
    p10.drawChar( 726,1,' ', GRAPHICS_NORMAL );
    d=0;
    break;

  case 110:
    LineCounter=1;
    ProductionDivHr=0;
    d=0;
    break;

  }

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


if (allcounter==1)
{
    LineCounter=1;
    allcounter=0;
//++++++++++++++++++LINE1++hourly++++++++++++++++++++++++++++++++++++++++++++++++++

      x=417;
      y=0;
      SMALLCONVERT(47,x,y);
      x=426;
      y=0;
      SMALLCONVERT(47,x,y);
      x=435;
      y=0;
      SMALLCONVERT(47,x,y);
      x=444;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++LINE2++hourlyt++++++++++++++++++++++++++++++++++++++++++++++++++

      x=462;
      y=0;
      SMALLCONVERT(47,x,y);
      x=471;
      y=0;
      SMALLCONVERT(47,x,y);
      x=480;
      y=0;
      SMALLCONVERT(47,x,y);
      x=489;
      y=0;
      SMALLCONVERT(47,x,y);
  
//++++++++++++++++++LINE3++hourlytarget++++++++++++++++++++++++++++++++++++++++++++++++++

      x=507;
      y=0;
      SMALLCONVERT(47,x,y);
      x=516;
      y=0;
      SMALLCONVERT(47,x,y);
      x=525;
      y=0;
      SMALLCONVERT(47,x,y);
      x=534;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++LINE4++hourlytarget++++++++++++++++++++++++++++++++++++++++++++++++++

      x=552;
      y=0;
      SMALLCONVERT(47,x,y);
      x=561;
      y=0;
      SMALLCONVERT(47,x,y);
      x=570;
      y=0;
      SMALLCONVERT(47,x,y);
      x=579;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++LINE5++hourlytarget++++++++++++++++++++++++++++++++++++++++++++++++++

      x=597;
      y=0;
      SMALLCONVERT(47,x,y);
      x=606;
      y=0;
      SMALLCONVERT(47,x,y);
      x=615;
      y=0;
      SMALLCONVERT(47,x,y);
      x=624;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++LINE6++hourlytarget++++++++++++++++++++++++++++++++++++++++++++++++++

      x=642;
      y=0;
      SMALLCONVERT(47,x,y);
      x=651;
      y=0;
      SMALLCONVERT(47,x,y);
      x=660;
      y=0;
      SMALLCONVERT(47,x,y);
      x=669;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++LINE7++hourlytarget++++++++++++++++++++++++++++++++++++++++++++++++++

      x=687;
      y=0;
      SMALLCONVERT(47,x,y);
      x=696;
      y=0;
      SMALLCONVERT(47,x,y);
      x=705;
      y=0;
      SMALLCONVERT(47,x,y);
      x=714;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++LINE8++hourlytarget++++++++++++++++++++++++++++++++++++++++++++++++++

      x=732;
      y=0;
      SMALLCONVERT(47,x,y);
      x=741;
      y=0;
      SMALLCONVERT(47,x,y);
      x=750;
      y=0;
      SMALLCONVERT(47,x,y);
      x=759;
      y=0;
      SMALLCONVERT(47,x,y);
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  delay(1000);
}

if (allrate==1){
    allrate=0;
    ProductionDivHr=1;
//++++++++++++++++++LINE1++target++++++++++++++++++++++++++++++++++++++++++++++++++

      x=1;
      y=0;
      SMALLCONVERT(47,x,y);
      x=10;
      y=0;
      SMALLCONVERT(47,x,y);
      x=19;
      y=0;
      SMALLCONVERT(47,x,y);
      x=28;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++LINE2++target++++++++++++++++++++++++++++++++++++++++++++++++++

      x=46;
      y=0;
      SMALLCONVERT(47,x,y);
      x=55;
      y=0;
      SMALLCONVERT(47,x,y);
      x=64;
      y=0;
      SMALLCONVERT(47,x,y);
      x=73;
      y=0;
      SMALLCONVERT(47,x,y);
  
//++++++++++++++++++LINE3++target++++++++++++++++++++++++++++++++++++++++++++++++++

      x=91;
      y=0;
      SMALLCONVERT(47,x,y);
      x=100;
      y=0;
      SMALLCONVERT(47,x,y);
      x=109;
      y=0;
      SMALLCONVERT(47,x,y);
      x=118;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++LINE4++target++++++++++++++++++++++++++++++++++++++++++++++++++

      x=136;
      y=0;
      SMALLCONVERT(47,x,y);
      x=145;
      y=0;
      SMALLCONVERT(47,x,y);
      x=154;
      y=0;
      SMALLCONVERT(47,x,y);
      x=163;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++LINE5++target++++++++++++++++++++++++++++++++++++++++++++++++++

      x=181;
      y=0;
      SMALLCONVERT(47,x,y);
      x=190;
      y=0;
      SMALLCONVERT(47,x,y);
      x=199;
      y=0;
      SMALLCONVERT(47,x,y);
      x=208;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++LINE6++target++++++++++++++++++++++++++++++++++++++++++++++++++

      x=226;
      y=0;
      SMALLCONVERT(47,x,y);
      x=235;
      y=0;
      SMALLCONVERT(47,x,y);
      x=244;
      y=0;
      SMALLCONVERT(47,x,y);
      x=253;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++LINE7++target++++++++++++++++++++++++++++++++++++++++++++++++++

      x=271;
      y=0;
      SMALLCONVERT(47,x,y);
      x=280;
      y=0;
      SMALLCONVERT(47,x,y);
      x=289;
      y=0;
      SMALLCONVERT(47,x,y);
      x=298;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++LINE8++target++++++++++++++++++++++++++++++++++++++++++++++++++

      x=316;
      y=0;
      SMALLCONVERT(47,x,y);
      x=325;
      y=0;
      SMALLCONVERT(47,x,y);
      x=334;
      y=0;
      SMALLCONVERT(47,x,y);
      x=343;
      y=0;
      SMALLCONVERT(47,x,y);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  delay(1000);
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


if (LineCounter==1)
{
  LineCounter=0;
//+++++++++++++++++++opereation Line Counter+++++++++++++++++++++++++++++++++++++++++++++++++++++++

  L1a= (L1/1000);
  L1b= (L1/100)%10;
  L1c= (L1/10)%10;
  L1d= (L1%10);

  L2a= (L2/1000);
  L2b= (L2/100)%10;
  L2c= (L2/10)%10;
  L2d= (L2%10);

  L3a= (L3/1000);
  L3b= (L3/100)%10;
  L3c= (L3/10)%10;
  L3d= (L3%10);

  L4a= (L4/1000);
  L4b= (L4/100)%10;
  L4c= (L4/10)%10;
  L4d= (L4%10);
  
  L5a= (L5/1000);
  L5b= (L5/100)%10;
  L5c= (L5/10)%10;
  L5d= (L5%10);

  L6a= (L6/1000);
  L6b= (L6/100)%10;
  L6c= (L6/10)%10;
  L6d= (L6%10);

  L7a= (L7/1000);
  L7b= (L7/100)%10;
  L7c= (L7/10)%10;
  L7d= (L7%10);

  L8a= (L8/1000);
  L8b= (L8/100)%10;
  L8c= (L8/10)%10;
  L8d= (L8%10);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//++++++++++++++++++LINE1++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=417;
      y=0;
      SMALLCONVERT(L1a,x,y);
      x=426;
      y=0;
      SMALLCONVERT(L1b,x,y);
      x=435;
      y=0;
      SMALLCONVERT(L1c,x,y);
      x=444;
      y=0;
      SMALLCONVERT(L1d,x,y);

//++++++++++++++++++LINE2++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=462;
      y=0;
      SMALLCONVERT(L2a,x,y);
      x=471;
      y=0;
      SMALLCONVERT(L2b,x,y);
      x=480;
      y=0;
      SMALLCONVERT(L2c,x,y);
      x=489;
      y=0;
      SMALLCONVERT(L2d,x,y);
  
//++++++++++++++++++LINE3++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=507;
      y=0;
      SMALLCONVERT(L3a,x,y);
      x=516;
      y=0;
      SMALLCONVERT(L3b,x,y);
      x=525;
      y=0;
      SMALLCONVERT(L3c,x,y);
      x=534;
      y=0;
      SMALLCONVERT(L3d,x,y);

//++++++++++++++++++LINE4++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=552;
      y=0;
      SMALLCONVERT(L4a,x,y);
      x=561;
      y=0;
      SMALLCONVERT(L4b,x,y);
      x=570;
      y=0;
      SMALLCONVERT(L4c,x,y);
      x=579;
      y=0;
      SMALLCONVERT(L4d,x,y);

//++++++++++++++++++LINE5++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=597;
      y=0;
      SMALLCONVERT(L5a,x,y);
      x=606;
      y=0;
      SMALLCONVERT(L5b,x,y);
      x=615;
      y=0;
      SMALLCONVERT(L5c,x,y);
      x=624;
      y=0;
      SMALLCONVERT(L5d,x,y);

//++++++++++++++++++LINE6++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=642;
      y=0;
      SMALLCONVERT(L6a,x,y);
      x=651;
      y=0;
      SMALLCONVERT(L6b,x,y);
      x=660;
      y=0;
      SMALLCONVERT(L6c,x,y);
      x=669;
      y=0;
      SMALLCONVERT(L6d,x,y);

//++++++++++++++++++LINE7++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=687;
      y=0;
      SMALLCONVERT(L7a,x,y);
      x=696;
      y=0;
      SMALLCONVERT(L7b,x,y);
      x=705;
      y=0;
      SMALLCONVERT(L7c,x,y);
      x=714;
      y=0;
      SMALLCONVERT(L7d,x,y);

//++++++++++++++++++LINE8++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=732;
      y=0;
      SMALLCONVERT(L8a,x,y);
      x=741;
      y=0;
      SMALLCONVERT(L8b,x,y);
      x=750;
      y=0;
      SMALLCONVERT(L8c,x,y);
      x=759;
      y=0;
      SMALLCONVERT(L8d,x,y);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
}

if (ProductionDivHr==1)
{
  ProductionDivHr=0;
  rateL1=L1/r;
  rateL2=L2/r;
  rateL3=L3/r;
  rateL4=L4/r;
  rateL5=L5/r;
  rateL6=L6/r;
  rateL7=L7/r;
  rateL8=L8/r;

  rateL1a=(rateL1/1000);
  rateL1b=(rateL1/100)%10;
  rateL1c=(rateL1/10)%10;
  rateL1d=(rateL1%10);
  
  rateL2a=(rateL2/1000);
  rateL2b=(rateL2/100)%10;
  rateL2c=(rateL2/10)%10;
  rateL2d=(rateL2%10);

  rateL3a=(rateL3/1000);
  rateL3b=(rateL3/100)%10;
  rateL3c=(rateL3/10)%10;
  rateL3d=(rateL3%10);

  rateL4a=(rateL4/1000);
  rateL4b=(rateL4/100)%10;
  rateL4c=(rateL4/10)%10;
  rateL4d=(rateL4%10);

  rateL5a=(rateL5/1000);
  rateL5b=(rateL5/100)%10;
  rateL5c=(rateL5/10)%10;
  rateL5d=(rateL5%10);

  rateL6a=(rateL6/1000);
  rateL6b=(rateL6/100)%10;
  rateL6c=(rateL6/10)%10;
  rateL6d=(rateL6%10);

  rateL7a=(rateL7/1000);
  rateL7b=(rateL7/100)%10;
  rateL7c=(rateL7/10)%10;
  rateL7d=(rateL7%10);

  rateL8a=(rateL8/1000);
  rateL8b=(rateL8/100)%10;
  rateL8c=(rateL8/10)%10;
  rateL8d=(rateL8%10);

  
//++++++++++++++++++LINE1++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=1;
      y=0;
      SMALLCONVERT(rateL1a,x,y);
      x=10;
      y=0;
      SMALLCONVERT(rateL1b,x,y);
      x=19;
      y=0;
      SMALLCONVERT(rateL1c,x,y);
      x=28;
      y=0;
      SMALLCONVERT(rateL1d,x,y);

//++++++++++++++++++LINE2++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=46;
      y=0;
      SMALLCONVERT(rateL2a,x,y);
      x=55;
      y=0;
      SMALLCONVERT(rateL2b,x,y);
      x=64;
      y=0;
      SMALLCONVERT(rateL2c,x,y);
      x=73;
      y=0;
      SMALLCONVERT(rateL2d,x,y);
  
//++++++++++++++++++LINE3++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=91;
      y=0;
      SMALLCONVERT(rateL3a,x,y);
      x=100;
      y=0;
      SMALLCONVERT(rateL3b,x,y);
      x=109;
      y=0;
      SMALLCONVERT(rateL3c,x,y);
      x=118;
      y=0;
      SMALLCONVERT(rateL3d,x,y);

//++++++++++++++++++LINE4++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=136;
      y=0;
      SMALLCONVERT(rateL4a,x,y);
      x=145;
      y=0;
      SMALLCONVERT(rateL4b,x,y);
      x=154;
      y=0;
      SMALLCONVERT(rateL4c,x,y);
      x=163;
      y=0;
      SMALLCONVERT(rateL4d,x,y);

//++++++++++++++++++LINE5++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=181;
      y=0;
      SMALLCONVERT(rateL5a,x,y);
      x=190;
      y=0;
      SMALLCONVERT(rateL5b,x,y);
      x=199;
      y=0;
      SMALLCONVERT(rateL5c,x,y);
      x=208;
      y=0;
      SMALLCONVERT(rateL5d,x,y);

//++++++++++++++++++LINE6++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=226;
      y=0;
      SMALLCONVERT(rateL6a,x,y);
      x=235;
      y=0;
      SMALLCONVERT(rateL6b,x,y);
      x=244;
      y=0;
      SMALLCONVERT(rateL6c,x,y);
      x=253;
      y=0;
      SMALLCONVERT(rateL6d,x,y);

//++++++++++++++++++LINE7++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=271;
      y=0;
      SMALLCONVERT(rateL7a,x,y);
      x=280;
      y=0;
      SMALLCONVERT(rateL7b,x,y);
      x=289;
      y=0;
      SMALLCONVERT(rateL7c,x,y);
      x=298;
      y=0;
      SMALLCONVERT(rateL7d,x,y);

//++++++++++++++++++LINE8++Display++++++++++++++++++++++++++++++++++++++++++++++++++

      x=316;
      y=0;
      SMALLCONVERT(rateL8a,x,y);
      x=325;
      y=0;
      SMALLCONVERT(rateL8b,x,y);
      x=334;
      y=0;
      SMALLCONVERT(rateL8c,x,y);
      x=343;
      y=0;
      SMALLCONVERT(rateL8d,x,y);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
}

}

void SMALLCONVERT(int DIGIT,int LOCx,int LOCy)
{

  switch (DIGIT){

  case 46:
      p10.writePixel( 0+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); 

    break;

  case 47:
      p10.writePixel( 0+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); 

    break;

  case 0:
      p10.writePixel( 0+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); 

    break;

  case 1:
      p10.writePixel( 0+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 );
      p10.writePixel( 0+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); 

    break;

  case 2:
      p10.writePixel( 0+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); 

    break;

  case 3:
      p10.writePixel( 0+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); 

    break;

  case 4:
      p10.writePixel( 0+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); 

    break;

  case 5:
      p10.writePixel( 0+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); 

    break;

  case 6:
      p10.writePixel( 0+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); 

    break;

  case 7:
      p10.writePixel( 0+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 6+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); 

    break;

  case 8:
      p10.writePixel( 0+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 7+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); 

    break;

  case 9:
      p10.writePixel( 0+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 0+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 0+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 1+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 1+LOCy, GRAPHICS_NORMAL, 0 );       p10.writePixel( 0+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 2+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 2+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 3+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 3+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 4+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 4+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 5+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 5+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 6+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 6+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 7+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 8+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 8+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 9+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 9+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 10+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 10+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 3+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 11+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 11+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 4+LOCx, 12+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 5+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 12+LOCy, GRAPHICS_NORMAL, 1 ); 
      p10.writePixel( 0+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 1+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 13+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 13+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 2+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 14+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 7+LOCx, 14+LOCy, GRAPHICS_NORMAL, 0 ); 
      p10.writePixel( 0+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 1+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 2+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 3+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 4+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 5+LOCx, 15+LOCy, GRAPHICS_NORMAL, 1 ); p10.writePixel( 6+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); p10.writePixel( 7+LOCx, 15+LOCy, GRAPHICS_NORMAL, 0 ); 

    break;

  }
}

