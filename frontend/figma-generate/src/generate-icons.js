/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const shell = require('shelljs');
const axios = require('axios');
const path = require('path');

const headers = new fetch.Headers();
const baseUrl = 'https://api.figma.com';

const devToken = process.env.FIGMA_TOKEN;
const fileKey = process.env.FIGMA_FILE_KEY;
const nodeId = process.env.FIGMA_ICONS_NODE_ID;
const version = process.env.FIGMA_VERSION;

const getNodeId = require('./lib/get-node-id');
const naming = require('./lib/naming.js');
const optimizeSvg = require('./lib/optimize-svg');

headers.append('X-Figma-Token', devToken);

const query = {
  path: path.join(__dirname, '../../../ui/atoms/icons'),
  fileName: 'var',
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

const download = async function (uri, filename) {
  const writer = fs.createWriteStream(filename);

  try {
    const response = await axios({
      url: uri,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'X-Figma-Token': devToken,
      },
    });
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', async () => {
        await optimizeSvg(filename);
        console.log('Downloaded!');
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.log('Failed');
  }
};

const pathIconsFolder = path.join(__dirname, '../../ui/atoms/icon/svg');
const pathSpriteFolder = path.join(__dirname, '../../ui/atoms/icon');

const typeIconsTemplate = names =>
  `export type IconType = ${names.map(name => `'${name}'`).join(' | ')}`;

async function main() {
  const {
    document: { children },
  } = await getNodeId(nodeId, fileKey, query.url);

  const iconNames = [];

  for await (const item of children) {
    if (item.type !== 'TEXT') {
      const resp = await fetch(`${baseUrl}/v1/images/${fileKey}?ids=${item.id}&format=svg`, {
        headers,
      });
      const { images } = await resp.json();
      const name = naming(item.name);
      console.log('####: name', name);
      iconNames.push(name);

      if (!fs.existsSync(pathIconsFolder)) {
        fs.mkdirSync(pathIconsFolder);
      }

      await download(`${images[item.id]}`, `${pathIconsFolder}/${name}.svg`);
    }
  }

  fs.writeFile(`${pathSpriteFolder}/types.ts`, typeIconsTemplate(iconNames), err => {
    if (err) console.log(err);
    shell.exec(`yarn eslint ${pathSpriteFolder}/types.ts --fix`);
    console.log('Wrote icons type ');
  });

  console.log('Start generation sprite');

  shell.exec(`yarn svg-sprite-generate -d ${pathIconsFolder} -o ${pathSpriteFolder}/sprite.svg`, {
    async: true,
  });
  console.log('End generation sprite');

  return true;
}

main().catch(err => {
  console.error(err);
  console.error(err.stack);
});
