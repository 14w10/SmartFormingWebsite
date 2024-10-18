import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { NextPageContext } from 'next';

import { createQueryFetcher } from './fetcher';

export const createQueryPrefetcher = (ctx: NextPageContext) => {
  const fetcher = createQueryFetcher(ctx);

  const queryClient = new QueryClient();
  const getDehydratedProps = () => ({ dehydratedState: dehydrate(queryClient) });

  return { queryCache: queryClient, getDehydratedProps, fetcher };
};
