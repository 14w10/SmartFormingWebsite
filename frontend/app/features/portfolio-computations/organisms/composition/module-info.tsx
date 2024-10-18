import { useMemo } from 'react';
import { useQuery } from 'react-query';
import dynamic from 'next/dynamic';

import { getComputationGraphicDataKey } from 'features/module-computations/api';
import { ComputationDescription } from 'features/module-computations/organisms/computation-description';
import { ComputationsInformation } from 'features/module-computations/organisms/computation-information';
import { useCurrentUser } from 'features/user';

const ComputationsChart = dynamic<any>(
  () =>
    import('features/module-computations/organisms/computation-chart').then(
      ({ ComputationsChart }) => ComputationsChart,
    ),
  { loading: () => <p>Loading chart...</p>, ssr: false },
);

export const ModuleInfo = ({ portfolioComputation }: { portfolioComputation: Computation }) => {
  const { currentUser } = useCurrentUser();
  const isUser = currentUser && currentUser.role === 'user';

  const { data: resultsData, isLoading, refetch: refetchGraphicData, isFetching } = useQuery<
    APIResponse<ComputationGraphicOptions>
  >(
    getComputationGraphicDataKey({
      computationResultId: portfolioComputation?.computationResultId as ID,
      isUser,
    }),
    { retry: 0, refetchOnMount: false },
  );

  return (
    <>
      <ComputationsInformation computationModule={portfolioComputation} />
      <ComputationDescription
        computationModule={portfolioComputation}
        resultsData={resultsData?.payload}
      />
      {resultsData && (
        <ComputationsChart
          resultsData={resultsData.payload}
          isLoading={isLoading}
          refetchGraphicData={refetchGraphicData}
          isFetching={isFetching}
        />
      )}
    </>
  );
};
