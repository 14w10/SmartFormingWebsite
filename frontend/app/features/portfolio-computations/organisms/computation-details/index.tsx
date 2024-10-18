import { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Button } from '@smar/ui';

import { redirect } from 'libs/redirect';
import { getComputationGraphicDataKey } from 'features/module-computations/api';
import { ComputationDescription } from 'features/module-computations/organisms/computation-description';
import { ComputationsInformation } from 'features/module-computations/organisms/computation-information';
import { useCurrentUser } from 'features/user';

import { getComputationsDetailsKey, sendComputationPortfolioScopeFormReq } from '../../api';
import { useComputationPortfolioForm } from '../../hooks/use-computation-portfolio';

const ComputationsChart = dynamic<any>(
  () =>
    import('features/module-computations/organisms/computation-chart').then(
      ({ ComputationsChart }) => ComputationsChart,
    ),
  { loading: () => <p>Loading chart...</p>, ssr: false },
);

export const ComputationDetails = ({ moduleIds }: { moduleIds: ID[] }) => {
  const { portfolio, countPreModules } = useComputationPortfolioForm();

  const { query, pathname, replace } = useRouter();
  const isNextUpload = countPreModules - 1 == ((query.module as any) || 0);
  const isLastModule =
    (portfolio?.payload.portfolioComputationModules.length || 0) - 1 == (query.module as any);
  const { data } = useQuery<APIResponse<Computation>>(
    getComputationsDetailsKey({ computationId: query.computationId as ID }),
  );
  const computationModule = data?.payload;
  const { currentUser } = useCurrentUser();
  const { data: resultsData, isLoading, refetch: refetchGraphicData, isFetching } = useQuery<
    APIResponse<ComputationGraphicOptions>
  >(
    getComputationGraphicDataKey({
      computationResultId: data?.payload?.computationResultId as ID,
      isUser: currentUser?.role === 'user',
    }),
    { retry: 0, refetchOnMount: false, enabled: !!data?.payload?.computationResultId },
  );

  const { mutate: sendComputationPortfolioScopeForm, ...reqState } = useMutation(
    sendComputationPortfolioScopeFormReq,
  );

  const submitLastModule = useCallback(() => {
    sendComputationPortfolioScopeForm(
      {
        portfolioComputationRequestIds: moduleIds,
        portfolioId: query.portfolioId as ID,
        authorId: currentUser?.id as ID,
      },
      {
        onSuccess: ({ data }: any) => {
          redirect(null, `/orders/portfolios/${data?.payload?.id}`);
        },
      },
    );
  }, [currentUser?.id, moduleIds, query.portfolioId, sendComputationPortfolioScopeForm]);

  const newQuery = useMemo(
    () =>
      isNextUpload
        ? { upload: true }
        : {
            module: query.upload ? countPreModules : (parseFloat(query.module as string) || 0) + 1,
          },
    [countPreModules, isNextUpload, query.module, query.upload],
  );

  if (!computationModule) return null;
  return (
    <div>
      <div className="flex justify-end mb-3">
        {!isLastModule ? (
          <Button
            onClick={() =>
              replace({
                pathname,
                query: {
                  portfolioId: query.portfolioId,
                  iteration: ((query.iteration && parseInt(query.iteration as any)) || 0) + 1,
                  ...newQuery,
                },
              })
            }
          >
            go to next module
          </Button>
        ) : (
          <Button onClick={submitLastModule} disabled={reqState.isLoading}>
            Finish computation
          </Button>
        )}
      </div>
      <ComputationsInformation computationModule={computationModule} />
      <ComputationDescription
        computationModule={computationModule}
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
    </div>
  );
};
