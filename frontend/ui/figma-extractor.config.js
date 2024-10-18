/** @param {string} name */
function getKeyName(name = '') {
  if (name.toLowerCase().startsWith('ui-kit') || name.toLowerCase().startsWith('ui kit')) {
    return 'INTERNAL_DO_NOT_USE';
  }

  /**
   * format name from like:
   *  "heading/h800 - bs" ->  "h800"
   *  "heading/h800 - md" ->  "h800-md"
   *  "conventions are ignored/heading/h800 - md bla bla" -> "h800-md"
   */
  const splittedName = name.split('/');
  const resultName = splittedName[splittedName.length - 1]
    .replace(' - ', '-')
    .split(' ')[0]
    .replace('-bs', '');

  return resultName;
}

const iconNaming = originalName => {
  const formattedName = originalName.replace(/ /g, '').replace('/', '-');
  return formattedName.toLowerCase();
};

module.exports = {
  apiKey: 'figd_XtRkGCV-dOyQpA-PAu5FN2Og7PqR_3L7VO7b29zM',
  fileId: 'cJEQadXO2GoUvbjOGtbAU9',
  styles: {
    exportPath: './theme',
    colors: {
      keyName: getKeyName,
    },
    effects: {},
    textStyles: {
      keyName: nameFromFigma => `.v-${getKeyName(nameFromFigma)}`,
    },
    gradients: {
      disabled: true,
    },
  },
  icons: {
    nodeIds: ['3861:578', '2090:11', '3887:602', '2310:0'],
    iconName: name => iconNaming(name), // custom format icon name
    exportPath: './atoms/icon',
    generateSprite: true,
    generateTypes: true,
  },
};
