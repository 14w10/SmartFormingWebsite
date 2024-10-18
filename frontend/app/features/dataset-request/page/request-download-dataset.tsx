import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { NextPage } from 'next';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button, Card, Typography } from '@smar/ui';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar } from 'features/layout';
import { getComputationModuleQueryKey } from 'features/store';

import { DownloadSelectedButton } from '../molecules/download-selected-button';
import { DatasetTable } from '../organisms/dataset-table';
import { columns } from '../organisms/dataset-table/columns';
import { DownloadProgressProvider } from '../use-download-proggress';

const DownloadForm: NextPage<{
  moduleId: ID;
}> = ({ moduleId }) => {
  const [rowSelection, setRowSelection] = useState({ free: {}, paid: {} });
  const { data: computationModule } = useQuery<ComputationModuleDTO>(
    getComputationModuleQueryKey({ moduleId }),
    { refetchOnWindowFocus: false },
  );

  const selectionCount = useMemo(
    () => Object.keys(rowSelection.free).length + Object.keys(rowSelection.paid).length,
    [rowSelection],
  );

  const breadcrumbs = useMemo(
    () => [
      { label: 'Marketplace' },
      { label: 'Functional modules', href: '/store/modules' },
      {
        label: computationModule?.payload.title as string,
        href: `/store/modules/${computationModule?.payload.id}`,
      },
      { label: 'Download form' },
    ],
    [computationModule?.payload.id, computationModule?.payload.title],
  );

  const datasetData = useMemo(
    () =>
      computationModule?.payload?.datasets?.reduce<{ free: IAttachFile[]; paid: IAttachFile[] }>(
        (acc, item) =>
          item.paid ? { ...acc, paid: [...acc.paid, item] } : { ...acc, free: [...acc.free, item] },
        { free: [], paid: [] },
      ) || { free: [], paid: [] },
    [computationModule?.payload?.datasets],
  );

  const table = useReactTable({
    data: datasetData?.free || [],
    columns,
    state: {
      rowSelection: rowSelection.free,
    },
    enableRowSelection: true,
    onRowSelectionChange: item =>
      setRowSelection(prev => ({ ...prev, free: (item as any)(prev.free) })),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const table2 = useReactTable({
    data: datasetData?.paid || [],
    columns,
    state: {
      rowSelection: rowSelection.paid,
    },
    enableRowSelection: true,
    onRowSelectionChange: item =>
      setRowSelection(prev => ({ ...prev, paid: (item as any)(prev.paid) })),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <LayoutWithSidebar breadcrumbs={breadcrumbs}>
      <Head title="Computation Form" />
      <Typography as="h1" variant="h300" mb={1}>
        {computationModule?.payload?.title}
      </Typography>
      <Typography as="h2" variant="text110" mb={1} color="secondaryDarkBlue900">
        Description
      </Typography>
      <Typography variant="p130" mb={3} color="secondaryDarkBlue910" style={{ maxWidth: 906 }}>
        {computationModule?.payload?.description}
      </Typography>
      <div className="flex gap-4">
        <div className="w-full">
          <DownloadProgressProvider>
            {computationModule?.payload?.datasets && (
              <Card>
                {datasetData?.free.length > 0 && (
                  <>
                    <Typography
                      variant="button120"
                      color="secondaryDarkBlue900"
                      mb={3}
                      className="uppercase"
                    >
                      Example dataset
                    </Typography>
                    <DatasetTable table={table} rowSelection={rowSelection.free} />
                  </>
                )}
                {datasetData?.paid.length > 0 && (
                  <>
                    <Typography
                      variant="button120"
                      color="secondaryDarkBlue900"
                      my={3}
                      className="uppercase"
                    >
                      paid dataset
                    </Typography>
                    <div className="relative" style={{ minHeight: 300 }}>
                      <div style={{ filter: 'blur(2px)' }}>
                        <DatasetTable table={table2} rowSelection={rowSelection.paid} />
                      </div>
                      <div className="absolute left-0 top-0 flex items-center justify-center w-full h-full">
                        <Card variant="sm" className="flex flex-col" style={{ width: 430 }}>
                          <Typography
                            variant="h170"
                            color="secondaryDarkBlue910"
                            mb={1}
                            textAlign="center"
                          >
                            Access Notice
                          </Typography>
                          <Typography
                            variant="p130"
                            color="secondaryDarkBlue920"
                            mb={2}
                            textAlign="center"
                          >
                            By getting access to other datasets connect to h.liu19@imperial.ac.uk
                          </Typography>
                          <Button as="a" href="mailto:h.liu19@imperial.ac.uk">
                            request access
                          </Button>
                        </Card>
                      </div>
                    </div>
                  </>
                )}
                <DownloadSelectedButton table={table} selectionCount={selectionCount} />
              </Card>
            )}
          </DownloadProgressProvider>
        </div>
        {datasetData?.paid.length > 0 && (
          <div className="flex-shrink-0 w-3/12">
            <Card variant="sm" className="flex flex-col">
              <Typography variant="h170" color="secondaryDarkBlue910" mb={1} textAlign="center">
                Access Notice
              </Typography>
              <Typography variant="p130" color="secondaryDarkBlue920" mb={2} textAlign="center">
                By getting access to other datasets connect to h.liu19@imperial.ac.uk
              </Typography>
              <Button as="a" href="mailto:h.liu19@imperial.ac.uk">
                request access
              </Button>
            </Card>
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  );
};

DownloadForm.getInitialProps = async ctx => {
  const props = {
    moduleId: ctx.query.moduleId?.toString() ?? '',
    formId: ctx.query.formId?.toString() ?? '',
  };

  if (!ctx.req) return props;

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  const a = await Promise.all([
    queryCache.fetchQuery(getComputationModuleQueryKey({ moduleId: props.moduleId }), fetcher),
  ]);

  return { ...props, ...getDehydratedProps() };
};

export const DownloadFormPage = withPageAuth({ roles: ['user'] })(DownloadForm);
