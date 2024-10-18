import { PageTitle } from 'ui-legacy';

import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';

import { CreateAdminForm } from '../organisms/create-admin-form';

const CreateAdmin = () => {
  return (
    <LayoutWithSidebar
      breadcrumbs={[
        { label: 'User list' },
        { label: 'Admins', href: '/admins' },
        { label: 'New Admin' },
      ]}
    >
      <Head title="New Admin" />
      <MaterialLayout>
        <PageTitle title="New Admin" />
        <CreateAdminForm />
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

export const CreateAdminPage = withPageAuth({ roles: ['admin'] })(CreateAdmin);
