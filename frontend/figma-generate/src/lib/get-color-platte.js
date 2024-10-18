/* eslint-disable @typescript-eslint/no-var-requires */
const naming = require('./naming.js');
const getNodeId = require('./get-node-id');
const camelCase = require('lodash.camelcase');

function RGBToHex(background) {
  r = Math.floor(background.r * 255).toString(16);
  g = Math.floor(background.g * 255).toString(16);
  b = Math.floor(background.b * 255).toString(16);

  if (r.length === 1) r = '0' + r;
  if (g.length === 1) g = '0' + g;
  if (b.length === 1) b = '0' + b;

  return r + g + b;
}

const RGB_HEX = /^#?(?:([\da-f]{3})[\da-f]?|([\da-f]{6})(?:[\da-f]{2})?)$/i;

const hex2RGB = str => {
  const [, short, long] = String(str).match(RGB_HEX) || [];

  if (long) {
    const value = Number.parseInt(long, 16);
    return [value >> 16, (value >> 8) & 0xff, value & 0xff];
  } else if (short) {
    return Array.from(short, s => Number.parseInt(s, 16)).map(n => (n << 4) | n);
  }
};

function formattedColor(background, opacity) {
  const hex = RGBToHex(background);

  if (opacity) {
    const rgb = hex2RGB(hex);

    return `rgba(${rgb.join(', ')}, ${opacity.toFixed(2)})`;
  }
  return `#${hex}`;
}

module.exports = async function (item, URLformat) {
  const { nodeId, fileKey } = item;
  const figmaTreeStructure = await getNodeId(nodeId, fileKey, URLformat);
  const { document } = figmaTreeStructure;
  const name = naming(document.name);

  console.log(name);

  return {
    [camelCase(name)]: formattedColor(document.fills[0].color, document.fills[0].opacity),
  };
};
