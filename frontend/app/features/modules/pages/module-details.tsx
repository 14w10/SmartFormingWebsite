import { useQuery } from 'react-query';
import { NextPage } from 'next';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';
import { getCurrentUserQueryKey, useCurrentUser } from 'features/user';

import { getModuleQueryKey } from '../api';
import { ModuleDetails as ModuleDetailsComponent } from '../organisms/module-details';

const ModuleDetailsImpl: NextPage<{ moduleId: string }> = ({ moduleId }) => {
  const { currentUser } = useCurrentUser();

  const isUser = currentUser && currentUser.role === 'user';
  const { data } = useQuery<ComputationModuleDTO>(
    getModuleQueryKey({ moduleId: moduleId as ID, isUser }),
  );
  return (
    <LayoutWithSidebar
      breadcrumbs={[
        { label: 'Submissions' },
        { label: isUser ? 'My Modules' : 'Modules', href: isUser ? '/my/modules' : '/modules' },
        { label: `"${data?.payload?.title}" module` },
      ]}
    >
      <Head title="Module Details" />
      <MaterialLayout>
        <ModuleDetailsComponent />
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

ModuleDetailsImpl.getInitialProps = async ctx => {
  const props = {
    moduleId: ctx.query.moduleId?.toString() ?? '',
  };

  if (!ctx.req) return props;

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  const data = await queryCache.fetchQuery<APIResponse<CurrentUser>>(
    getCurrentUserQueryKey(),
    fetcher,
  );
  const isUser = data?.payload?.role === 'user';
  await queryCache.fetchQuery(getModuleQueryKey({ moduleId: props.moduleId, isUser }), fetcher);

  return { ...props, ...getDehydratedProps() };
};

export const ModuleDetailsPage = withPageAuth({ roles: ['admin', 'editor'] })(
  ModuleDetailsImpl as any,
);
export const UserModuleDetailsPage = withPageAuth({ roles: ['user'] })(ModuleDetailsImpl as any);
