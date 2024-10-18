import { QueryFunctionContext } from 'react-query';
import { NextPageContext } from 'next';

import { apiClient, createApiClient } from '../api';

/** Next.js like url: /user/[id] */
type QueryKeyUrl = string;
type QueryKeyParams = Record<string, any>;

const buildQueryKey = (rawUrl: QueryKeyUrl, paramsKey: QueryKeyParams, pageParam: unknown) => {
  const pageParams = typeof pageParam === 'object' ? pageParam : {};
  const params = { ...paramsKey, ...pageParams };
  let url = rawUrl;

  Object.entries(params).forEach(([key, val]) => {
    const keyRegExp = new RegExp(`\\[${key}\\]`, 'g');

    if (url.search(keyRegExp) >= 0) {
      delete params[key];
      url = url.replace(new RegExp(keyRegExp), val);
    }
  });

  return { url, params };
};

export const createQueryFetcher = (ctx?: NextPageContext) => {
  const client = ctx?.req ? createApiClient(ctx) : apiClient;

  return <T>(context: QueryFunctionContext<string | any>) => {
    const [urlKey, paramsKey] = context.queryKey;

    const { url, params } = buildQueryKey(urlKey, paramsKey, context.pageParam);
    return client
      .get<T>(url, { params })
      .then(res => res.data);
  };
};
