import { useEffect } from 'react';
import { NextPage, NextPageContext } from 'next';

import { merge } from 'libs/merge';
import { createQueryPrefetcher } from 'libs/react-query';
import { redirect } from 'libs/redirect';
import { getCurrentUserQueryKey, useCurrentUser } from 'features/user';

import { checkAuth } from './helpers';
import { useCheckAuth } from './hooks';
import { AuthParams } from './types';

export const withPageAuth = (
  authParams: AuthParams,
  /** calculate redirect url
   * return nullable value to disable redirect
   * @default '/sign-in'
   */
  getRedirectUrl: (usr: CurrentUser, ctx?: NextPageContext) => string | void = () => '/sign-in',
) => <P extends object>(WrappedComponent: NextPage<P>) => {
  const WithPageAuth: NextPage<P> = (props: P) => {
    const { currentUser } = useCurrentUser();
    const { isPermitted, isLoaded } = useCheckAuth(authParams);

    // client side auth check
    useEffect(() => {
      if (!isPermitted && isLoaded) {
        const url = getRedirectUrl(currentUser);
        if (url) redirect(null, url);
      }
    }, [isPermitted, isLoaded, currentUser]);

    if (isPermitted) {
      return <WrappedComponent {...props} />;
    }

    // TODO: nice loading
    return null;
  };

  WithPageAuth.getInitialProps = async (ctx: NextPageContext) => {
    let extraDehydratedState = {};

    // server side auth check
    if (ctx.res) {
      const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);
      const data = await queryCache
        .fetchQuery<APIResponse<CurrentUser>>(getCurrentUserQueryKey(), fetcher)
        .catch(() => null);
      extraDehydratedState = getDehydratedProps().dehydratedState;

      const currentUser = data?.payload;

      if (!checkAuth(authParams, currentUser)) {
        const url = getRedirectUrl(currentUser, ctx);
        if (url) redirect(ctx, url);
      }
    }

    let pageProps: any = {};

    if (WrappedComponent.getInitialProps) {
      pageProps = await WrappedComponent.getInitialProps(ctx);
    }

    return {
      ...pageProps,
      dehydratedState: merge(pageProps?.dehydratedState, extraDehydratedState),
    } as any;
  };

  return WithPageAuth;
};
