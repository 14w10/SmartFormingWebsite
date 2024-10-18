import { useState } from 'react';

import { TabItem, TabsWrapper } from '@smar/ui';

import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar } from 'features/layout';

import { CreateDataModuleForm } from '../organisms/data-module-form/create';
import { CreateFunctionModuleForm } from '../organisms/function-module-form/create';

const tabs = [
  { id: 'functionalModule', title: 'Model' },
  { id: 'dataModule', title: 'Data' },
];

const CreateImpl = () => {
  const [activeTab, activeTabSet] = useState(tabs[0].id);

  return (
    <LayoutWithSidebar
      breadcrumbs={[
        { label: 'My account' },
        { label: 'My Modules', href: '/my/modules' },
        { label: 'Upload module' },
      ]}
    >
      <Head title="Upload Functional Module" />
      <h1 className="v-h300 mb-2">Upload Functional Module</h1>
      <div>
        <TabsWrapper>
          {tabs.map(item => (
            <TabItem
              key={item.id}
              title={item.title}
              active={activeTab === item.id}
              onClick={() => activeTabSet(item.id)}
            />
          ))}
        </TabsWrapper>
      </div>
      {activeTab === 'functionalModule' && <CreateFunctionModuleForm />}
      {activeTab === 'dataModule' && <CreateDataModuleForm />}
    </LayoutWithSidebar>
  );
};

export const CreateModulePage = withPageAuth({ roles: ['user'] })(CreateImpl);
