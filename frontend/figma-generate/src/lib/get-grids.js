/* eslint-disable @typescript-eslint/no-var-requires */
const naming = require('./naming.js');
const getNodeId = require('./get-node-id');

module.exports = async function (item, URLformat) {
  const { nodeId, fileKey } = item;
  const figmaTreeStructure = await getNodeId(nodeId, fileKey, URLformat);
  const { document } = figmaTreeStructure;
  return {
    size: {
      grids: {
        [naming(document.name)]: {
          gutter: {
            value: document.layoutGrids[0].gutterSize,
            type: 'grids',
          },
          offset: {
            value: document.layoutGrids[0].offset,
            type: 'grids',
          },
        },
      },
    },
    grids: {
      [naming(document.name)]: {
        count: {
          value: document.layoutGrids[0].count,
          type: 'grids',
        },
      },
    },
  };
};
