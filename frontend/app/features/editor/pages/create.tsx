import { PageTitle } from 'ui-legacy';

import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar, MaterialLayout } from 'features/layout';

import { CreateEditorForm } from '../organisms/create-editor-form';

const CreateEditor = () => {
  return (
    <LayoutWithSidebar
      breadcrumbs={[
        { label: 'User list' },
        { label: 'Editors', href: '/editors' },
        { label: 'New Editor' },
      ]}
    >
      <Head title="New Editor" />
      <MaterialLayout>
        <PageTitle title="New Editor" />
        <CreateEditorForm />
      </MaterialLayout>
    </LayoutWithSidebar>
  );
};

export const CreateEditorPage = withPageAuth({ roles: ['admin'] })(CreateEditor);
