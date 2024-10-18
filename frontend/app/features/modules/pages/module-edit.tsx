import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { PageTitle } from 'ui-legacy';

import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';
import { useCurrentUser } from 'features/user';

import { getModuleQueryKey } from '../api';
import { EditDataModuleForm } from '../organisms/data-module-form/edit';
import { EditFunctionModuleForm } from '../organisms/function-module-form/edit';

const EditModuleImpl = () => {
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const isUser = currentUser && currentUser.role === 'user';

  const { data } = useQuery<ComputationModuleDTO>(
    getModuleQueryKey({ moduleId: query.moduleId as ID, isUser }),
  );

  const breadcrumbs = useMemo(() => {
    const base = [
      { label: isUser ? 'My Modules' : 'Modules', href: isUser ? '/my/modules' : '/modules' },
      {
        label: `Details module "${data?.payload.title}"`,
        href: isUser ? `/my/modules/${query.moduleId}` : `/modules/${query.moduleId}`,
      },
      { label: 'Edit module' },
    ];

    if (isUser) {
      return [{ label: 'My account' }, ...base];
    }

    return [{ label: 'Submissions' }, ...base];
  }, [data?.payload.title, isUser, query.moduleId]);

  return (
    <LayoutWithSidebar breadcrumbs={breadcrumbs}>
      <Head title="Edit Module" />
      <MaterialLayout>
        <PageTitle title="Edit Module" />
        {data?.payload.moduleContentType === 'data_module' && (
          <EditDataModuleForm moduleData={data?.payload} />
        )}
        {data?.payload.moduleContentType === 'functional_module' && (
          <EditFunctionModuleForm moduleData={data?.payload} />
        )}
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

export const EditModulePage = withPageAuth({ roles: ['editor', 'admin'] })(EditModuleImpl);

export const UserEditModulePage = withPageAuth({ roles: ['user'] })(EditModuleImpl);
