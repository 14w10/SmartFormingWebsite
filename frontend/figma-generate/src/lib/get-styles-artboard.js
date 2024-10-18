/* eslint-disable @typescript-eslint/no-var-requires */
const getFiles = require('./get-files.js');
const getFontStyles = require('./get-font-styles.js');
const getColorPlatte = require('./get-color-platte.js');
const getGrids = require('./get-grids.js');
const getEffect = require('./get-effect.js');

const matchStyleType = {
  colors: 'FILL',
  grids: 'GRID',
  typography: 'TEXT',
  effects: 'EFFECT',
};

module.exports = async function (key, urlFormat, typeStyle) {
  const figmaId = key;
  const figmaTreeStructure = await getFiles(key, urlFormat);
  const { styles } = figmaTreeStructure;

  let stylesArr = Array.isArray(styles) ? styles : Object.keys(styles);

  if (typeStyle) {
    stylesArr = stylesArr.filter(item => styles[item].styleType === matchStyleType[typeStyle]);
  }

  const baseTokeensJSON = {
    color: {},
    size: {
      font: {},
      grids: {},
      lineheight: {},
    },
    font: {
      family: {},
      weight: {},
      spacing: {},
    },
    grids: {},
    effects: {},
  };

  for (const item of stylesArr) {
    const nodeId = item;
    const styleType = styles[item].styleType;

    if (styleType === 'TEXT') {
      const fonts = await getFontStyles(
        {
          nodeId,
          fileKey: figmaId,
        },
        urlFormat,
      );

      Object.assign(baseTokeensJSON.size.font, fonts.size.font);
      Object.assign(baseTokeensJSON.size.lineheight, fonts.size.lineheight);
      Object.assign(baseTokeensJSON.font.family, fonts.font.family);
      Object.assign(baseTokeensJSON.font.weight, fonts.font.weight);
      Object.assign(baseTokeensJSON.font.spacing, fonts.font.spacing);
    }

    if (styleType === 'FILL') {
      const color = await getColorPlatte(
        {
          nodeId: nodeId,
          fileKey: figmaId,
        },
        urlFormat,
      );

      baseTokeensJSON.color = {
        ...baseTokeensJSON.color,
        ...color,
      };
    }

    if (styleType === 'GRID') {
      const grids = await getGrids(
        {
          nodeId: nodeId,
          fileKey: figmaId,
        },
        urlFormat,
      );
      Object.assign(baseTokeensJSON.size.grids, grids.size.grids);
      Object.assign(baseTokeensJSON.grids, grids.grids);
    }

    if (styleType === 'EFFECT') {
      const effect = await getEffect(
        {
          nodeId: nodeId,
          fileKey: figmaId,
        },
        urlFormat,
      );

      Object.assign(baseTokeensJSON.effects, effect);
    }
  }

  return baseTokeensJSON;
};
