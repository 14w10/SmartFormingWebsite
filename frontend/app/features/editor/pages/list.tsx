import { useQuery } from 'react-query';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PageTitle, Pagination, SearchField } from 'ui-legacy';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';
import { useCurrentUser } from 'features/user';

import { getEditorListQueryKey } from '../api';
import { EditorListTable } from '../organisms/editor-table';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    borderRadius: '8px',
  },
}));

const EditorList: NextPage = () => {
  const classes = useStyles();
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const { data, isLoading } = useQuery<APIListResponse<Editor>>(getEditorListQueryKey(query));

  return (
    <LayoutWithSidebar breadcrumbs={[{ label: 'User list' }, { label: 'Editors' }]}>
      <Head title="Editors" />
      <MaterialLayout>
        <PageTitle title="Editors">
          {currentUser && currentUser.role === 'admin' && (
            <Link href="/editors/create">
              <Button component="a" variant="contained" color="primary">
                Add
              </Button>
            </Link>
          )}
        </PageTitle>

        <Box display="flex" alignItems="center" justifyContent="stretch">
          <Box width="100%">
            <Paper elevation={0}>
              <SearchField />
            </Paper>
          </Box>
        </Box>
        <Paper className={classes.root} elevation={0}>
          <EditorListTable items={data?.payload} isLoading={isLoading} />
        </Paper>
        <Pagination totalCount={data?.meta.totalCount} />
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

EditorList.getInitialProps = async ctx => {
  if (!ctx.req) return {};

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await queryCache.fetchQuery(getEditorListQueryKey(ctx.query), fetcher);

  return getDehydratedProps();
};

export const EditorListPage = withPageAuth({ roles: ['admin', 'editor'] })(EditorList);
