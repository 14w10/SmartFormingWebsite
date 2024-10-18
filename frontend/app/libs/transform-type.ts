export const transformType = (moduleType: IModule['moduleType']) => {
  if (!moduleType) return undefined;
  const i = moduleType.indexOf('-');
  const type = `${moduleType.charAt(0).toUpperCase()}${moduleType.slice(1, i)}${moduleType
    .slice(i)
    .toUpperCase()}`;

  return type;
};
