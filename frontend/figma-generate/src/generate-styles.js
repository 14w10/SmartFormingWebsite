/* eslint-disable @typescript-eslint/no-var-requires */
const styleType = process.argv[2] || null;
const prefixNameStyle = process.argv[3] || null;

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const dotenvOptions = {};

if (prefixNameStyle) {
  dotenvOptions.path = `.env.${prefixNameStyle}`;
}
dotenv.config(dotenvOptions);
const fetch = require('node-fetch');
const shell = require('shelljs');

const getStylesArtboard = require('./lib/get-styles-artboard.js');
const getSpacers = require('./lib/get-spacers.js');
const getBorderRadius = require('./lib/get-border-radius.js');
// const getFonts = require('./lib/create-fonts-styles.js');
const getColorsTypes = require('./lib/create-colors-types.js');

const headers = new fetch.Headers();

const devToken = process.env.FIGMA_TOKEN;
const fileKey = process.env.FIGMA_FILE_KEY;
const borderRadiusId = process.env.BORDER_RADIUS;
const spacersId = process.env.SPACERS;
const version = process.argv[6];

headers.append('X-Figma-Token', devToken);

const query = {
  url: {
    host: 'api.figma.com',
    protocol: 'https',
  },
};

if (version) {
  query.url = {
    ...query.url,
    query: {
      version,
    },
  };
}

async function main() {
  console.log('> We start, please wait...');

  const style = await getStylesArtboard(fileKey, query.url, styleType);

  let result = style;
  // const { fonts, fontsTypes } = await getFonts(result);
  const colorsTypes = await getColorsTypes(result);

  if (spacersId) {
    const spacers = await getSpacers(spacersId, fileKey, query.url);
    result = {
      ...style,
      size: {
        ...style.size,
        spacers,
      },
    };
  }

  if (borderRadiusId) {
    const borderRadius = await getBorderRadius(borderRadiusId, fileKey, query.url);
    result = {
      ...result,
      size: {
        ...result.size,
        borderRadius,
      },
    };
  }
  const template = `export const colors = ${JSON.stringify(
    result.color,
  )} ;\nexport type colorsType = ${colorsTypes}`;

  fs.writeFile(path.join(__dirname, '../../ui/theme/theme-colors.ts'), template, err => {
    if (err) console.log(err);
    shell.exec(`yarn eslint packages/ui/theme/theme-colors.ts --fix`);
    console.log(`wrote theme-colors.ts`);
  });

  // fs.writeFile(
  //   path.join(__dirname, '../../ui/theme/theme-fonts.ts'),
  //   `export const fonts = ${JSON.stringify(fonts)} ; export type fontsType = ${fontsTypes}`,
  //   err => {
  //     if (err) console.log(err);
  //     shell.exec(`yarn eslint packages/ui/theme/theme-fonts.ts --fix`);
  //     console.log(`wrote theme-fonts.ts`);
  //   },
  // );
}

main().catch(err => {
  console.error(err);
  console.error(err.stack);
});
