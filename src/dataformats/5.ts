export interface DataformatV5 {
  humidity: number;
  temperature: number;
  pressure: number;
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;
  battery: number;
  txPower: number;
  movementCounter: number;
  measurementSequenceNumber: number;
}

export const parse = (data: Buffer): DataformatV5 => {
  let temperature = (data[3] << 8) | (data[4] & 0xff);
  if (temperature > 32767) {
    temperature -= 65534;
  }

  let accelerationX = (data[9] << 8) | (data[10] & 0xff);
  if (accelerationX > 32767) accelerationX -= 65536; //two's complement

  let accelerationY = (data[11] << 8) | (data[12] & 0xff);
  if (accelerationY > 32767) accelerationY -= 65536; //two's complement

  let accelerationZ = (data[13] << 8) | (data[14] & 0xff);
  if (accelerationZ > 32767) accelerationZ -= 65536; //two's complement

  let powerInfo = ((data[15] & 0xff) << 8) | (data[16] & 0xff);

  return {
    temperature: temperature / 200.0,
    humidity: (((data[5] & 0xff) << 8) | (data[6] & 0xff)) / 400.0,
    pressure: (((data[7] & 0xff) << 8) | (data[8] & 0xff)) + 50000,
    accelerationX,
    accelerationY,
    accelerationZ,
    battery: (powerInfo >>> 5) + 1600,
    txPower: (powerInfo & 0b11111) * 2 - 40,
    movementCounter: data[17] & 0xff,
    measurementSequenceNumber: ((data[18] & 0xff) << 8) | (data[19] & 0xff),
  };
};
