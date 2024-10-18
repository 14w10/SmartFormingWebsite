module.exports = async function (result) {
  let types = '';
  Object.entries(result.color).map(([key]) => (types = types + `'colors.${key}' | `));
  types = types.substring(0, types.length - 3);
  return types;
};
