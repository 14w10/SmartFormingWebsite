import { useQuery } from 'react-query';
import { NextPage } from 'next';
import { PageTitle, Placeholder } from 'ui-legacy';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';

import { getUserQueryKey } from '../api';
import { DetailsList } from '../organisms/details-list';

const UserDetails: NextPage<{ userId: string }> = ({ userId }) => {
  const { data } = useQuery<APIResponse<User>>(getUserQueryKey({ userId }));

  return (
    <LayoutWithSidebar
      breadcrumbs={[
        { label: 'User list' },
        { label: 'Users', href: '/users' },
        { label: 'User Details' },
      ]}
    >
      <Head title="User Details" />
      <MaterialLayout>
        <PageTitle title="User Details" />

        {data?.payload ? <DetailsList user={data.payload} /> : <Placeholder />}
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

UserDetails.getInitialProps = async ctx => {
  const props = {
    userId: ctx.query.userId?.toString() ?? '',
  };

  if (!ctx.req) return props;

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await queryCache.fetchQuery(getUserQueryKey(props), fetcher);

  return { ...props, ...getDehydratedProps() };
};

export const UserDetailsPage = withPageAuth({ roles: ['admin', 'editor'] })(UserDetails);
