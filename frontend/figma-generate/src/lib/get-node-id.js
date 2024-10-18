/* eslint-disable @typescript-eslint/no-var-requires */
const URL = require('url');
const fetch = require('node-fetch');
const headers = new fetch.Headers();
const devToken = process.env.FIGMA_TOKEN;
headers.append('X-Figma-Token', devToken);

module.exports = async function (nodeId, fileKey, URLformat) {
  URLformat = {
    ...URLformat,
    pathname: `/v1/files/${fileKey}/nodes`,
    query: {
      ...URLformat.query,
      ids: nodeId,
    },
  };
  const result = await fetch(`${URL.format(URLformat).toString()}`, { headers });
  const figmaTreeStructure = await result.json();
  if (figmaTreeStructure.err) {
    console.error('\n\n ERROR: ', figmaTreeStructure.err, '\n\n');
  }

  return figmaTreeStructure.nodes[nodeId];
};
