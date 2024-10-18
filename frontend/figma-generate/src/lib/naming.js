const SEPARATOR_NAME = '-';

module.exports = function (name, separator = SEPARATOR_NAME) {
  return name
    .toLowerCase()
    .replace(/ /gi, `${separator}`)
    .replace(/\//gi, `${separator}`)
    .replace(/-/gi, `${separator}`);
};
