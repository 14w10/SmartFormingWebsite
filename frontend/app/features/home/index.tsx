import { NextPage, NextPageContext } from 'next';

import { createQueryPrefetcher } from 'libs/react-query';
import { redirect } from 'libs/redirect';
import { getCurrentUserQueryKey } from 'features/user';

export const HomePage: NextPage<any> = () => null;

HomePage.getInitialProps = async (ctx: NextPageContext) => {
  const { queryCache, fetcher } = createQueryPrefetcher(ctx);
  const data = await queryCache
    .fetchQuery<APIResponse<CurrentUser>>(getCurrentUserQueryKey(), fetcher)
    .catch(() => null);

  if (data?.payload && data?.payload?.role !== 'user') {
    redirect(ctx, '/signups');
  } else {
    redirect(ctx, '/store/modules');
  }

  return {};
};
