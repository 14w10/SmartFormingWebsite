/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('../../jest.config.base');

const packageName = require('./package.json').name.split('@shared/').pop();

module.exports = {
  ...baseConfig,
  name: packageName,
  displayName: packageName,
  roots: [__dirname],
  transformIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
