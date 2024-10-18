import { useQuery } from 'react-query';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PageTitle, Pagination, SearchField } from 'ui-legacy';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';

import { getUserListQueryKey } from '../api';
import { UserListTable } from '../organisms/users-table';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    borderRadius: '8px',
  },
}));

const UserList: NextPage = () => {
  const classes = useStyles();
  const { query } = useRouter();
  const { data, isLoading } = useQuery<APIListResponse<User>>(getUserListQueryKey(query));

  return (
    <LayoutWithSidebar breadcrumbs={[{ label: 'User list' }, { label: 'Users' }]}>
      <Head title="Users" />
      <MaterialLayout>
        <PageTitle title="Users" />

        <Box display="flex" alignItems="center" justifyContent="stretch">
          <Box width="100%">
            <Paper elevation={0}>
              <SearchField />
            </Paper>
          </Box>
        </Box>
        <Paper className={classes.root} elevation={0}>
          <UserListTable items={data?.payload} isLoading={isLoading} />
        </Paper>
        <Pagination totalCount={data?.meta.totalCount} />
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

UserList.getInitialProps = async ctx => {
  if (!ctx.req) return {};

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await queryCache.fetchQuery(getUserListQueryKey(ctx.query), fetcher);

  return getDehydratedProps();
};

export const UserListPage = withPageAuth({ roles: ['admin', 'editor'] })(UserList);
