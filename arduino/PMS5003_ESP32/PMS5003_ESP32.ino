#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_BMP3XX.h"

#define WIFI_SEND_URL "http://220.135.93.231:1234/recv_data"
#define WIFI_TEMP_URL "http://220.135.93.231:1234/recv_temp"
#define SEALEVELPRESSURE_HPA (1013.25)

const char *ssid = "2.4G";
const char *password = "12345qwert";
Adafruit_BMP3XX bmp;

WiFiServer server(80); // Set web server port number to 80

void setup()
{
  // our debugging output
  Serial.begin(115200);

  // sensor baud rate is 9600
  Serial2.begin(9600);

  // test BMP388
  if (!bmp.begin_I2C())
  {
    Serial.println("Could not find a valid BMP3 sensor, check wiring!");
    while (1)
      ;
  }
  bmp.setTemperatureOversampling(BMP3_OVERSAMPLING_8X);
  bmp.setPressureOversampling(BMP3_OVERSAMPLING_4X);
  bmp.setIIRFilterCoeff(BMP3_IIR_FILTER_COEFF_3);
  bmp.setOutputDataRate(BMP3_ODR_50_HZ);

  // Connect to Wi-Fi network with SSID and password
  Serial.println("");
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  server.begin();
}

struct pms5003data
{
  uint16_t framelen;
  uint16_t pm10_standard, pm25_standard, pm100_standard;
  uint16_t pm10_env, pm25_env, pm100_env;
  uint16_t particles_03um, particles_05um, particles_10um, particles_25um, particles_50um, particles_100um;
  uint16_t unused;
  uint16_t checksum;
};

struct pms5003data data;
//WiFiClient client;
HTTPClient http;

void loop()
{
  if (readPMSdata(&Serial2))
  {
    // reading data was successful!
    Serial.println();
    Serial.println(F("---------------------------------------"));
    Serial.println(F("Concentration Units (standard)"));
    Serial.print(F("PM 1.0: "));
    Serial.print(data.pm10_standard);
    Serial.print(F("\t\tPM 2.5: "));
    Serial.print(data.pm25_standard);
    Serial.print(F("\t\tPM 10: "));
    Serial.println(data.pm100_standard);
    Serial.println(F("---------------------------------------"));
    Serial.println(F("Concentration Units (environmental)"));
    Serial.print(F("PM 1.0: "));
    Serial.print(data.pm10_env);
    Serial.print(F("\t\tPM 2.5: "));
    Serial.print(data.pm25_env);
    Serial.print(F("\t\tPM 10: "));
    Serial.println(data.pm100_env);
    Serial.println(F("---------------------------------------"));
    Serial.print(F("Particles > 0.3um / 0.1L air:"));
    Serial.println(data.particles_03um);
    Serial.print(F("Particles > 0.5um / 0.1L air:"));
    Serial.println(data.particles_05um);
    Serial.print(F("Particles > 1.0um / 0.1L air:"));
    Serial.println(data.particles_10um);
    Serial.print(F("Particles > 2.5um / 0.1L air:"));
    Serial.println(data.particles_25um);
    Serial.print(F("Particles > 5.0um / 0.1L air:"));
    Serial.println(data.particles_50um);
    Serial.print(F("Particles > 10.0 um / 0.1L air:"));
    Serial.println(data.particles_100um);
    Serial.println(F("---------------------------------------"));

    if (WiFi.status() == WL_CONNECTED)
    {
      String url = String(WIFI_SEND_URL);
      url += "?pm10_standard=" + String(data.pm10_standard);
      url += "&pm25_standard=" + String(data.pm25_standard);
      url += "&pm100_standard=" + String(data.pm100_standard);
      url += "&pm10_env=" + String(data.pm10_env);
      url += "&pm25_env=" + String(data.pm25_env);
      url += "&pm100_env=" + String(data.pm100_env);
      url += "&particles_03um=" + String(data.particles_03um);
      url += "&particles_05um=" + String(data.particles_05um);
      url += "&particles_10um=" + String(data.particles_10um);
      url += "&particles_25um=" + String(data.particles_25um);
      url += "&particles_50um=" + String(data.particles_50um);
      url += "&particles_100um=" + String(data.particles_100um);

      // Serial.println();
      // Serial.print("url:");
      // Serial.println(url);
      // Serial.println();

      http.begin(url);
      int httpCode = http.GET();
      http.end();
    }
  }

  if (bmp.performReading())
  {
    Serial.println();
    Serial.print("Temperature = ");
    Serial.print(bmp.temperature);
    Serial.println(" *C");

    Serial.print("Pressure = ");
    Serial.print(bmp.pressure / 100.0);
    Serial.println(" hPa");

    Serial.print("Approx. Altitude = ");
    Serial.print(bmp.readAltitude(SEALEVELPRESSURE_HPA));
    Serial.println(" m");

    Serial.println();

    if (WiFi.status() == WL_CONNECTED)
    {
      String url = String(WIFI_TEMP_URL);
      url += "?temperature=" + String(bmp.temperature);
      url += "&pressure=" + String(bmp.pressure / 100.0);
      url += "&altitude=" + String(bmp.readAltitude(SEALEVELPRESSURE_HPA));

      // Serial.println();
      // Serial.print("url:");
      // Serial.println(url);
      // Serial.println();

      http.begin(url);
      int httpCode = http.GET();
      http.end();
    }
  }

  delay(2000);
}

boolean readPMSdata(Stream *s)
{
  if (!s->available())
  {
    return false;
  }

  // Read a byte at a time until we get to the special '0x42' start-byte
  if (s->peek() != 0x42)
  {
    s->read();
    return false;
  }

  // Now read all 32 bytes
  if (s->available() < 32)
  {
    return false;
  }

  uint8_t buffer[32];
  uint16_t sum = 0;
  s->readBytes(buffer, 32);

  // get checksum ready
  for (uint8_t i = 0; i < 30; i++)
  {
    sum += buffer[i];
  }

  /* debugging
  for (uint8_t i=2; i<32; i++) {
    Serial.print("0x"); Serial.print(buffer[i], HEX); Serial.print(", ");
  }
  Serial.println();
  */

  // The data comes in endian'd, this solves it so it works on all platforms
  uint16_t buffer_u16[15];
  for (uint8_t i = 0; i < 15; i++)
  {
    buffer_u16[i] = buffer[2 + i * 2 + 1];
    buffer_u16[i] += (buffer[2 + i * 2] << 8);
  }

  // put it into a nice struct :)
  memcpy((void *)&data, (void *)buffer_u16, 30);

  if (sum != data.checksum)
  {
    Serial.println("Checksum failure");
    return false;
  }
  // success!
  return true;
}
