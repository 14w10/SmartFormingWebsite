import Link from 'next/link';
import { Box, Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { SubjectList, PageTitle, Pagination, SearchField } from 'ui-legacy';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';
import { useAllTests } from '../api';
import {useMemo} from 'react'

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

const ChroniclesSubmissionsImpl = () => {
  const { query } = useRouter();
  const classes = useStyles();
  const breadcrumbs = [{ label: 'My account' }, { label: 'My Chronicles' }]
  const {data, isLoading} = useAllTests({ status: 'new', per: 25, ...query });
  const transformedData = useMemo(() => {
    if (!data) {
      return { payload: [], meta: { totalPages: 0, totalCount: 0 } }; 
    }
    
    const allTestsMap = data.allTests || {};

    // Extract templates array from the map
    const templates = Object.keys(allTestsMap).map((key) => {
      const test = allTestsMap[key];
      return test.templates || [];
    }).reduce((acc, val) => acc.concat(val), []);

    // Paginate the templates
    const paginatedTemplates = templates;

    return {
      payload: paginatedTemplates,
      meta: {
        totalPages: null,
        totalCount: templates.length,
      },
    };
  }, [data])

  return (
    <LayoutWithSidebar breadcrumbs={breadcrumbs}>
      <Head title={'My Chronicles'} />
      <MaterialLayout>
        <PageTitle title={'My Chronicles'}>
          { (
            <Link href="/chronicles/upload" passHref>
              <Button component="a" variant="contained" color="primary">
                <PublishIcon className={classes.iconButton} />
                Upload
              </Button>
            </Link>
          )}
        </PageTitle>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Paper elevation={0}>
            <SearchField />
          </Paper>
        </Box>

        <SubjectList
          items={transformedData?.payload || []}
          isLoading={isLoading}
          linkPrefix={`/my/chronicles`}
        />
        <Pagination totalCount={transformedData?.meta.totalCount || 0} />
      </MaterialLayout>
    </LayoutWithSidebar>
  );
}
  
export const UserChroniclesListPage = withPageAuth({ roles: ['user'] })(ChroniclesSubmissionsImpl as any);
