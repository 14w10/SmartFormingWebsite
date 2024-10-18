import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Paper } from '@material-ui/core';
import { ListWithIcon, PageTitle, Pagination, SearchField, StatusTabs } from 'ui-legacy';

import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';
import { useCurrentUser } from 'features/user';

import { getComputationsKey } from '../api';

const tabs = [
  {
    query: 'new',
    title: 'new',
  },
  {
    query: 'processing',
    title: 'processing',
  },
  {
    query: 'finished',
    title: 'finished',
  },
  {
    query: 'declined',
    title: 'declined',
  },
];

const ComputationListImpl = () => {
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const isUser = currentUser && currentUser.role === 'user';
  const { data, isLoading } = useQuery<APIListResponse<Computation>>(
    getComputationsKey({ ...query, isUser }),
  );

  return (
    <LayoutWithSidebar
      breadcrumbs={[
        { label: 'SUBMISSIONS' },
        { label: !isUser ? 'Module Computations' : 'Functional Module Computations' },
      ]}
    >
      <Head title={!isUser ? 'Module Computations' : 'Functional Module Computations'} />
      <MaterialLayout>
        <PageTitle title={!isUser ? 'Module Computations' : 'Functional Module Computations'} />

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <StatusTabs tabs={tabs} />
          <Paper elevation={0}>
            <SearchField />
          </Paper>
        </Box>

        <ListWithIcon
          items={data?.payload}
          isLoading={isLoading}
          linkPrefix={!isUser ? '/computations' : '/orders/modules'}
        />
        <Pagination totalCount={data?.meta.totalCount || 0} />
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

export const ComputationList = withPageAuth({
  roles: ['admin', 'editor', 'user'],
})(ComputationListImpl);
