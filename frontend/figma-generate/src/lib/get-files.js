/* eslint-disable @typescript-eslint/no-var-requires */
const URL = require('url');
const fetch = require('node-fetch');
const headers = new fetch.Headers();
const devToken = process.env.FIGMA_TOKEN;
headers.append('X-Figma-Token', devToken);

module.exports = async function (fileKey, URLformat) {
  URLformat = {
    ...URLformat,
    pathname: `/v1/files/${fileKey}`,
  };
  const result = await fetch(`${URL.format(URLformat).toString()}`, { headers });
  const figmaTreeStructure = await result.json();

  return figmaTreeStructure;
};
