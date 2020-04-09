// This function is borrowed from https://github.com/ojousima/node-red/blob/master/ruuvi-node/ruuvitag.js
// which is licenced under BSD-3
// Credits to GitHub user ojousima

export interface DataformatV3 {
  humidity: number;
  temperature: number;
  pressure: number;
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;
  battery: number;
}

const parseRawRuuvi = (manufacturerDataString: string): DataformatV3 => {
  let humidityStart = 6;
  let humidityEnd = 8;
  let temperatureStart = 8;
  let temperatureEnd = 12;
  let pressureStart = 12;
  let pressureEnd = 16;
  let accelerationXStart = 16;
  let accelerationXEnd = 20;
  let accelerationYStart = 20;
  let accelerationYEnd = 24;
  let accelerationZStart = 24;
  let accelerationZEnd = 28;
  let batteryStart = 28;
  let batteryEnd = 32;

  let humidity = parseInt(manufacturerDataString.substring(humidityStart, humidityEnd));
  humidity /= 2; //scale

  let temperatureString = manufacturerDataString.substring(temperatureStart, temperatureEnd);
  let temperature = parseInt(temperatureString.substring(0, 2), 16); //Full degrees
  temperature += parseInt(temperatureString.substring(2, 4), 16) / 100; //Decimals
  if (temperature > 128) {
    // Ruuvi format, sign bit + value
    temperature = temperature - 128;
    temperature = 0 - temperature;
  }

  let pressure = parseInt(manufacturerDataString.substring(pressureStart, pressureEnd), 16); // uint16_t pascals
  pressure += 50000; //Ruuvi format

  let accelerationX = parseInt(manufacturerDataString.substring(accelerationXStart, accelerationXEnd), 16); // milli-g
  if (accelerationX > 32767) {
    accelerationX -= 65536;
  } //two's complement

  let accelerationY = parseInt(manufacturerDataString.substring(accelerationYStart, accelerationYEnd), 16); // milli-g
  if (accelerationY > 32767) {
    accelerationY -= 65536;
  } //two's complement

  let accelerationZ = parseInt(manufacturerDataString.substring(accelerationZStart, accelerationZEnd), 16); // milli-g
  if (accelerationZ > 32767) {
    accelerationZ -= 65536;
  } //two's complement

  let battery = parseInt(manufacturerDataString.substring(batteryStart, batteryEnd), 16); // milli-g

  return {
    humidity,
    temperature: +temperature.toFixed(2),
    pressure,
    accelerationX,
    accelerationY,
    accelerationZ,
    battery,
  };
};

export const parse = (buffer: Buffer): DataformatV3 => parseRawRuuvi(buffer.toString("hex"));
