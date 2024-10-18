import { useMemo, useState } from 'react';

import { TabItem, TabsWrapper } from '@smar/ui';

import { ModuleInfo } from './module-info';

export const Composition = ({ portfolioModule }: { portfolioModule: Portfolio }) => {
  const [activeTab, activeTabSet] = useState(
    portfolioModule?.portfolioComputationModules[0]?.computationModule.id,
  );

  const computationModule = useMemo(
    () =>
      portfolioModule.portfolioComputationModules?.find(
        item => item.computationModule?.id === activeTab,
      )?.computationModule,
    [activeTab, portfolioModule.portfolioComputationModules],
  );

  const tabs = useMemo(
    () =>
      portfolioModule?.portfolioComputationModules.map((item, i) => ({
        title: `Module ${i + 1}`,
        description: item.computationModule.moduleType,
        id: item.computationModule.id,
      })),
    [portfolioModule?.portfolioComputationModules],
  );

  const activeModuleNumber = useMemo(
    () => tabs.reduce((acc, item, i) => (item.id === activeTab ? i : acc), 0),
    [activeTab, tabs],
  );

  return (
    <div>
      <h2 className="v-text110 text-secondaryDarkBlue900 mb-1">portfolio composition</h2>
      <TabsWrapper>
        {tabs?.map(item => (
          <TabItem
            key={item.id}
            title={item.title}
            description={item.description}
            active={item.id === activeTab}
            onClick={() => activeTabSet(item.id)}
          />
        ))}
      </TabsWrapper>
      {computationModule && (
        <>
          <h2 className="v-text110 text-secondaryDarkBlue900 mb-1">
            Module {activeModuleNumber + 1} Information
          </h2>
          <ModuleInfo computationModule={computationModule} />
        </>
      )}
    </div>
  );
};
