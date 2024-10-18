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

import { getModulesQueryKey } from '../api';

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

const ModulesSubmissionsImpl = () => {
  const classes = useStyles();
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const isEditor = currentUser?.role === 'editor';
  const isAdmin = currentUser?.role === 'admin';
  const isUser = currentUser?.role === 'user';

  const tabs = useMemo(
    () => [
      {
        query: 'new',
        title: 'new',
        show: isEditor || isAdmin || isUser,
      },
      {
        query: 'under_review',
        title: 'under review',
        show: isEditor || isAdmin || isUser,
      },
      {
        query: 'approved',
        title: 'approved',
        show: isEditor || isAdmin || isUser,
      },
      {
        query: 'published',
        title: 'published',
        show: isAdmin || isUser,
      },
      {
        query: 'rejected',
        title: 'rejected',
        show: isAdmin || isUser,
      },
    ],
    [isAdmin, isEditor, isUser],
  );

  const { data, isLoading } = useQuery<APIListResponse<Module>>(
    getModulesQueryKey({ isUser: !!isUser, status: 'new', per: 25, ...query }),
  );

  const breadcrumbs = useMemo(
    () =>
      isUser
        ? [{ label: 'My account' }, { label: 'My Modules' }]
        : [{ label: 'Submissions' }, { label: 'Modules' }],
    [isUser],
  );

  return (
    <LayoutWithSidebar breadcrumbs={breadcrumbs}>
      <Head title={!isUser ? 'Module Submissions' : 'My Functional Modules'} />
      <MaterialLayout>
        <PageTitle title={!isUser ? 'Module Submissions' : 'My Functional Modules'}>
          {isUser && (
            <Link href="/modules/upload" passHref>
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
          items={data?.payload || []}
          isLoading={isLoading}
          isUser={isUser}
          linkPrefix={`${!isUser ? '' : '/my'}/modules`}
        />
        <Pagination totalCount={data?.meta.totalCount || 0} />
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

export const ModuleListPage = withPageAuth({ roles: ['admin', 'editor'] })(
  ModulesSubmissionsImpl as any,
);

export const UserModuleListPage = withPageAuth({ roles: ['user'] })(ModulesSubmissionsImpl as any);
