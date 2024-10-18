import { FC, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Hydrate } from 'react-query/hydration';

import { redirect } from 'libs/redirect';

import { createQueryFetcher } from './fetcher';

interface ReactQueryProviderProps {
  client?: QueryClient;
  dehydratedState: unknown;
  children?: ReactNode;
}

let isRedirecting = false;

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: createQueryFetcher(),
      onError: (err: any) => {
        if (err && err.statusCode === 401 && !isRedirecting) {
          isRedirecting = true;
          redirect(null, '/sign-in').then(() => {
            isRedirecting = false;
          });
        }
      },
    },
  },
});

export const ReactQueryProvider: FC<ReactQueryProviderProps> = ({
  client = defaultQueryClient,
  children,
  dehydratedState,
}) => {
  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools />
      <Hydrate state={dehydratedState}>{children}</Hydrate>
    </QueryClientProvider>
  );
};

export { createQueryPrefetcher } from './ssr-dehydrate';
