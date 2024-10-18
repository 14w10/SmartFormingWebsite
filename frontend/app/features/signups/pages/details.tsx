import { useQuery } from 'react-query';
import { NextPage } from 'next';
import { PageTitle, Placeholder } from 'ui-legacy';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';

import { getSignUpRequestQueryKey } from '../api';
import { DetailsList } from '../organisms/details-list';

const SignUpRequestDetails: NextPage<{ signUpId: string }> = ({ signUpId }) => {
  const { data } = useQuery<APIResponse<SignUpRequest>>(getSignUpRequestQueryKey({ signUpId }));

  return (
    <LayoutWithSidebar
      breadcrumbs={[
        { label: 'User list' },
        { label: 'Signup Requests', href: '/signups' },
        { label: 'Request Details' },
      ]}
    >
      <Head title="Request Details" />
      <MaterialLayout>
        <PageTitle title="Request Details" />

        {data?.payload ? <DetailsList request={data.payload} /> : <Placeholder />}
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

SignUpRequestDetails.getInitialProps = async ctx => {
  const props = {
    signUpId: ctx.query.signUpId?.toString() ?? '',
  };

  if (!ctx.req) return props;

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await queryCache.fetchQuery(getSignUpRequestQueryKey(props), fetcher);

  return { ...props, ...getDehydratedProps() };
};

export const SignUpRequestDetailsPage = withPageAuth({ roles: ['admin', 'editor'] })(
  SignUpRequestDetails,
);
