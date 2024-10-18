import { useQuery } from 'react-query';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PageTitle, Pagination, SearchField, StatusTabs } from 'ui-legacy';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';

import { getSignUpRequestListQueryKey } from '../api';
import { RequestListTable } from '../organisms/request-table';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    borderRadius: '8px',
  },
}));

const tabs = [
  {
    title: 'new',
    query: 'new',
  },
  {
    title: 'approved',
    query: 'approved',
  },
  {
    title: 'declined',
    query: 'declined',
  },
];

const SignUpRequestList: NextPage = () => {
  const classes = useStyles();
  const { query } = useRouter();
  const { data, isLoading } = useQuery<APIListResponse<SignUpRequest>>(
    getSignUpRequestListQueryKey(query),
  );

  return (
    <LayoutWithSidebar breadcrumbs={[{ label: 'User list' }, { label: 'Signup Requests' }]}>
      <Head title="Signup Requests" />
      <MaterialLayout>
        <PageTitle title="Signup Requests" />
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <StatusTabs tabs={tabs} />
          <Paper elevation={0}>
            <SearchField />
          </Paper>
        </Box>
        <Paper className={classes.root} elevation={0}>
          <RequestListTable items={data?.payload} isLoading={isLoading} />
        </Paper>
        <Pagination totalCount={data?.meta.totalCount} />
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

SignUpRequestList.getInitialProps = async ctx => {
  if (!ctx.req) return {};

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await queryCache.fetchQuery(getSignUpRequestListQueryKey(ctx.query), fetcher);

  return getDehydratedProps();
};

export const SignUpRequestListPage = withPageAuth({ roles: ['admin', 'editor'] })(
  SignUpRequestList,
);
