import { NextPageContext } from 'next';
import axios from 'axios';

import { handleError, handleRes } from './interceptors';
import { defaultResponseTransformer } from './transformers';

const getConfig = (ctx?: NextPageContext) => {
  const config = {
    baseURL: process.env.NEXT_PUBLIC_APP_URL + '/api',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  } as any;

  if (ctx?.req?.headers) {
    const { cookie = '' } = ctx.req.headers;
    config.headers = { ...config.headers, cookie };
  }

  return config;
};

export const createApiClient = (ctx?: NextPageContext) => {
  const client = axios.create({
    transformResponse: defaultResponseTransformer,
    ...getConfig(ctx),
  });

  // Add a request interceptor
  client.interceptors.request.use(config => {
    return config;
  }, handleError);

  // Add a response interceptor
  client.interceptors.response.use(handleRes, handleError);

  return client;
};

export const apiClient = createApiClient();

apiClient.interceptors.request.use(config => {
  if (!process.browser) {
    throw new Error(
      'apiClient should be used client side only. You should createApiClient on each request',
    );
  }

  return config;
}, handleError);
