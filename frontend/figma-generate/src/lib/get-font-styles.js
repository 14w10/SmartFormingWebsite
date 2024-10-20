/* eslint-disable @typescript-eslint/no-var-requires */
const naming = require('./naming.js');
const getNodeId = require('./get-node-id');

module.exports = async function (item, URLformat) {
  const { nodeId, fileKey } = item;
  const figmaTreeStructure = await getNodeId(nodeId, fileKey, URLformat);
  const { document } = figmaTreeStructure;
  return {
    size: {
      font: {
        [naming(document.name)]: {
          value: document.style.fontSize,
          type: 'typography',
        },
      },
      lineheight: {
        [naming(document.name)]: {
          value: (document.style.lineHeightPercentFontSize / 100).toFixed(2),
          type: 'typography',
        },
      },
    },
    font: {
      family: {
        [naming(document.name)]: {
          value: `${document.style.fontFamily}, ${document.style.fontPostScriptName}`,
          type: 'typography',
        },
      },
      weight: {
        [naming(document.name)]: {
          value: document.style.fontWeight,
          type: 'typography',
        },
      },
      spacing: {
        [naming(document.name)]: {
          value:
            document.style.letterSpacing !== 0 ? `${document.style.letterSpacing}px` : 'normal',
          type: 'typography',
        },
      },
    },
  };
};
