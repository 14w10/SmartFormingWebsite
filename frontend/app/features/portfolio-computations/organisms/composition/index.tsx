import { useMemo, useState } from 'react';

import { TabItem, TabsWrapper } from '@smar/ui';

import { ModuleInfo } from './module-info';

export const Composition = ({
  portfolioComputations,
}: {
  portfolioComputations: PortfolioRequest['portfolioComputationRequests'];
}) => {
  const [activeTab, activeTabSet] = useState(portfolioComputations?.[0]?.id);

  const portfolioComputation = useMemo(
    () => portfolioComputations?.find(item => item.id === activeTab),
    [activeTab, portfolioComputations],
  );

  const tabs = useMemo(
    () =>
      portfolioComputations?.map((item, i) => ({
        title: `Module ${i + 1}`,
        description: item.computationModuleType,
        id: item.id,
      })),
    [portfolioComputations],
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
      {portfolioComputation && <ModuleInfo portfolioComputation={portfolioComputation} />}
    </div>
  );
};
