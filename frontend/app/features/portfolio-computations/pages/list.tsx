import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Paper } from '@material-ui/core';
import { ListWithIcon, PageTitle, Pagination, SearchField, StatusTabs } from 'ui-legacy';

import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';
import { useCurrentUser } from 'features/user';

import { getPortfolioRequestsKey } from '../api';

const tabs = [
  {
    query: 'new',
    title: 'new',
  },
  {
    query: 'approved',
    title: 'approved',
  },
  {
    query: 'declined',
    title: 'declined',
  },
];

const ListPage = () => {
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const isUser = currentUser && currentUser.role === 'user';

  const { data, isLoading } = useQuery<APIListResponse<Computation>>(
    getPortfolioRequestsKey({ isUser, ...query }),
  );

  return (
    <LayoutWithSidebar
      breadcrumbs={[{ label: 'SUBMISSIONS' }, { label: 'Portfolio Computations' }]}
    >
      <Head title="Portfolio Computations" />
      <MaterialLayout>
        <PageTitle title="Portfolio Computations" />

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <StatusTabs tabs={tabs} />
          <Paper elevation={0}>
            <SearchField />
          </Paper>
        </Box>

        <ListWithIcon
          items={data?.payload}
          isLoading={isLoading}
          linkPrefix={isUser ? '/orders/portfolios' : '/portfolio-requests'}
        />
        <Pagination totalCount={data?.meta.totalCount} />
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

export const AdminPortfolioRequestsListPage = withPageAuth({
  roles: ['admin', 'editor'],
})(ListPage);

export const UserPortfolioRequestsListPage = withPageAuth({
  roles: ['user'],
})(ListPage);
