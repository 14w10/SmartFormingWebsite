import { useQuery } from 'react-query';
import { NextPage } from 'next';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';
import { getModuleQueryKey } from 'features/modules';

import { FormBuilderActionsProvider } from '../hooks/use-form-builder';
import { Template } from '../template';

const CreateComputationFormBuilder: NextPage<{
  moduleId: ID;
}> = ({ moduleId }) => {
  const { data: computationModule } = useQuery<ComputationModuleDTO>(
    getModuleQueryKey({ moduleId }),
    { refetchOnWindowFocus: false },
  );

  return (
    <FormBuilderActionsProvider>
      <LayoutWithSidebar
        breadcrumbs={[
          { label: 'Modules', href: `/modules` },
          { label: 'Module Details', href: `/modules/${moduleId}` },
          { label: `Create "${computationModule?.payload.title}" Form Builder` },
        ]}
      >
        <Head title="Computation Form Builder" />
        <MaterialLayout>
          <Template />
        </MaterialLayout>
      </LayoutWithSidebar>
    </FormBuilderActionsProvider>
  );
};

CreateComputationFormBuilder.getInitialProps = async ctx => {
  const props = {
    moduleId: ctx.query.moduleId?.toString() ?? '',
  };

  if (!ctx.req) return props;

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await queryCache.fetchQuery(
    getModuleQueryKey({ moduleId: props.moduleId, isUser: false }),
    fetcher,
  );

  return { ...props, ...getDehydratedProps() };
};

export const CreateComputationFormBuilderPage = withPageAuth(
  { pageType: 'privateOnly', roles: ['admin', 'editor'] },
  () => '/',
)(CreateComputationFormBuilder);
