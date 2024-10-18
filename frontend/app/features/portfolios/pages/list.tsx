import { useMemo } from 'react';
import { useQuery } from 'react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import { ModulesList, PageTitle, Pagination, SearchField, StatusTabs } from 'ui-legacy';

import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';
import { useCurrentUser } from 'features/user';

import { getPortfoliosQueryKey } from '../api';

const tabs = [
  {
    query: 'new',
    title: 'new',
  },
  {
    query: 'under_review',
    title: 'under review',
  },
  {
    query: 'published',
    title: 'published',
  },
  {
    query: 'rejected',
    title: 'rejected',
  },
];

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    borderRadius: 8,
  },
  iconButton: {
    marginRight: 8,
  },
}));

const PortfolioList = () => {
  const classes = useStyles();
  const { query } = useRouter();

  const { currentUser } = useCurrentUser();
  const isUser = currentUser && currentUser.role === 'user';
  const isAdmin = currentUser && currentUser.role === 'admin';

  const { data, isLoading } = useQuery<APIListResponse<Module>>(
    getPortfoliosQueryKey({ ...query, isUser: !!isUser }),
  );

  const breadcrumbs = useMemo(
    () =>
      isUser
        ? [{ label: 'My account' }, { label: 'My Portfolios' }]
        : [{ label: 'Submissions' }, { label: 'Portfolio Submissions' }],
    [isUser],
  );

  return (
    <LayoutWithSidebar breadcrumbs={breadcrumbs}>
      <Head title={!isUser ? 'Portfolio Submissions' : 'My Portfolios'} />
      <MaterialLayout>
        <PageTitle title={!isUser ? 'Portfolio Submissions' : 'My Portfolios'}>
          {isAdmin && (
            <Link href="/upload/portfolio" passHref>
              <Button component="a" variant="contained" color="primary">
                <PublishIcon className={classes.iconButton} />
                Upload
              </Button>
            </Link>
          )}
        </PageTitle>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <StatusTabs tabs={tabs} />
          <Paper elevation={0}>
            <SearchField />
          </Paper>
        </Box>

        <ModulesList
          items={data?.payload}
          isLoading={isLoading}
          linkPrefix={!isUser ? '/portfolios' : '/my/portfolios'}
        />
        <Pagination totalCount={data?.meta.totalCount} />
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

export const AdminPortfolioListPage = withPageAuth({
  roles: ['admin', 'editor'],
})(PortfolioList);

export const UserPortfolioListPage = withPageAuth({
  roles: ['user'],
})(PortfolioList);
