import toCamel from 'camelcase-keys';
import Jsona from 'jsona';
import toSnake from 'snakecase-keys';

export const dataFormatter = new Jsona();

export const caseParams = { deep: true, exclude: [/^_/] };

export const toSnakeCase = (data = {}) => toSnake(data, caseParams);

export const toCamelCase = (data = {}) => toCamel(data, caseParams);
