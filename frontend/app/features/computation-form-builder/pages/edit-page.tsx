import { useQuery } from 'react-query';
import { NextPage } from 'next';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';
import { getModuleQueryKey } from 'features/modules';

import { getFormBuilderQueryKey } from '../api';
import { FormBuilderActionsProvider } from '../hooks/use-form-builder';
import { getInitialSchema } from '../schema';
import { Template } from '../template';

interface EditComputationFormBuilder {
  moduleId: ID;
  builderId: ID;
  payload: {
    steps: ReturnType<typeof getInitialSchema>[];
    files: IFileField[];
    filesBlockEnabled: boolean;
    computationModuleId: number;
  };
}

export const EditComputationFormBuilder: NextPage<{ moduleId: ID; builderId: ID }> = ({
  builderId,
  moduleId,
}) => {
  const { data: computationModule } = useQuery<ComputationModuleDTO>(
    getModuleQueryKey({ moduleId }),
    { refetchOnWindowFocus: false },
  );
  const { data } = useQuery<ComputationFormBuilderDTO>(getFormBuilderQueryKey({ builderId }));

  return (
    <LayoutWithSidebar
      breadcrumbs={[
        { label: 'Modules', href: `/modules` },
        { label: 'Module Details', href: `/modules/${moduleId}` },
        { label: `Edit "${computationModule?.payload.title}" Form Builder` },
      ]}
    >
      <Head title="Edit Computation Form Builder" />
      <MaterialLayout>
        {data ? (
          <FormBuilderActionsProvider
            initialValueProps={{
              schema: (data?.payload.steps || []) as any[],
              fileFields: data?.payload.files,
              filesBlockEnabled: data?.payload.filesBlockEnabled,
              currentTab: data && Object.keys(data?.payload.steps[0].properties)?.[0],
            }}
          >
            <Template />
          </FormBuilderActionsProvider>
        ) : (
          'Loading...'
        )}
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

EditComputationFormBuilder.getInitialProps = async ctx => {
  const props = {
    moduleId: ctx.query.moduleId?.toString() ?? '',
    builderId: ctx.query.builderId?.toString() ?? '',
  };
  if (!ctx.req) return props;
  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await Promise.all([
    queryCache.fetchQuery(getModuleQueryKey({ moduleId: props.moduleId }), fetcher),
    queryCache.fetchQuery(getFormBuilderQueryKey({ builderId: props.builderId }), fetcher),
  ]);

  return { ...props, ...getDehydratedProps() };
};

export const EditComputationFormBuilderPage = withPageAuth(
  { roles: ['admin', 'editor'] },
  () => '/',
)(EditComputationFormBuilder);
