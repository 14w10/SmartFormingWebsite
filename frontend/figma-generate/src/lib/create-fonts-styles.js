module.exports = async function (result) {
  const convertArrayToObject = array => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item]: {},
      };
    }, initialValue);
  };

  const types = Object.entries(result.font.family)
    .filter(value => value[0] && /---/.test(value))
    .map(value => value[0].split('---')[1].split('.')[0]);

  const uniqueTypes = [...new Set(types)];
  const objectWithTypes = convertArrayToObject(uniqueTypes);
  let fontsTypes = '';

  for (let i = 0; i < Object.entries(result.size.font).length; i++) {
    const screenSize = Object.entries(result.size.font)[i][0].split('---')[1].split('.')[0];
    const name = Object.entries(result.size.font)[i][0].split('---')[1].split('.')[1];
    fontsTypes = fontsTypes + `'${screenSize}.${name}' | `;

    objectWithTypes[screenSize][name] = {
      font: `${Object.entries(result.font.weight)[i][1].value} ${
        Object.entries(result.size.font)[i][1].value
      }px / ${Object.entries(result.size.lineheight)[i][1].value}  ${
        Object.entries(result.font.family)[i][1].value
      }`,
    };
  }

  return { fonts: objectWithTypes, fontsTypes: fontsTypes.substring(0, fontsTypes.length - 3) };
};
