import * as dataformatV2_V4 from "../dataformats/2and4";
import * as dataformatV3 from "../dataformats/3";
import * as dataformatV5 from "../dataformats/5";

function stripUrl(url) {
  const match = url.match(/#(.+)$/);
  return match ? match[1] : new Error("Invalid url");
}

function getReadings(encodedData) {
  function addPaddingIfNecessary(str) {
    // if encoded data is truncated (data format 4), add some random padding
    return str.length === 9 ? str + "a==" : str;
  }

  const buffer = Buffer.from(addPaddingIfNecessary(encodedData), "base64");

  // validate
  if (buffer.length < 6 || buffer.length > 7) {
    return new Error("Invalid data");
  }
  const dataFormat = buffer[0];

  return dataFormat === 2 || dataFormat === 4
    ? Object.assign({ dataFormat: dataFormat }, dataformatV2_V4.parse(buffer))
    : new Error("Unsupported data format: " + dataFormat);
}

export const parseUrl = url => {
  if (!url.match(/ruu\.vi/)) {
    return new Error("Not a ruuviTag url");
  }

  const encodedData = stripUrl(url);

  return encodedData instanceof Error ? encodedData : getReadings(encodedData);
};

export const parseManufacturerData = (dataBuffer: Buffer) => {
  switch (dataBuffer[2]) {
    case 3:
      return dataformatV3.parse(dataBuffer);
    case 5:
      return dataformatV5.parse(dataBuffer);
    default:
      return new Error("Data format not supported");
  }
};
