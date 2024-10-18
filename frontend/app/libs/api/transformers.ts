import fclone from 'fclone';
import Jsona from 'jsona';
import { assocPath, compose } from 'ramda';

import { toSnakeCase } from './data-formatter';

export interface IJsonApiError {
  source: { pointer: string };
  detail: string;
}

export const formatErrors = (data: IJsonApiError[] | string = []) => {
  let globalError;
  let unformattedErrors;

  if (typeof data === 'string') {
    globalError = data;
  } else {
    unformattedErrors = data.reduce((acc, err) => {
      const path = err.source.pointer.split(/\/|\./).filter(item => item !== '');

      return assocPath(path, err.detail, acc);
    }, {});
  }
  return { errors: unformattedErrors, globalError };
};

export const transformRequest = (data: any) => {
  if (typeof data !== 'object') {
    return JSON.stringify(data);
  }

  return JSON.stringify(toSnakeCase(data));
};

export const transformResponse = (transformer: any) => (data: string) => {
  if (!data) {
    return null;
  }

  try {
    const parsed = JSON.parse(data);

    const transformedResponse = transformer(parsed);
    const { globalError, errors } = formatErrors(parsed.error || parsed.errors);

    const formatted = {
      payload: transformedResponse,
      meta: parsed.meta || {},
      errors,
      error: globalError,
    };

    return formatted;
  } catch (error) {
    return data;
  }
};

export const dataFormatter = new Jsona();
const deserialize = (data: any) => dataFormatter.deserialize(data);

const getDeserializedData = compose(fclone, deserialize);

export const defaultResponseTransformer = transformResponse(getDeserializedData);
