import { useQuery } from 'react-query';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { Typography } from '@smar/ui';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar } from 'features/layout';
import { getCurrentUserQueryKey, useCurrentUser } from 'features/user';

import { getComputationGraphicDataKey, getComputationKey } from '../api';
import { ComputationDescription } from '../organisms/computation-description';
import { ComputationsInformation } from '../organisms/computation-information';
import { RejectSection } from '../organisms/reject-section';
import { StatusButtons } from '../organisms/status-buttons';

const ComputationsChart = dynamic<any>(
  () => import('../organisms/computation-chart').then(({ ComputationsChart }) => ComputationsChart),
  { loading: () => <p>Loading chart...</p>, ssr: false },
);

const ComputationDetailsImpl: NextPage<{ computationId: ID }> = ({ computationId }) => {
  const { currentUser } = useCurrentUser();
  console.log('🚀 ~ file: details.tsx:88 ~ computationId:', computationId);
  const isUser = currentUser && currentUser.role === 'user';

  const { data } = useQuery<APIResponse<Computation>>(getComputationKey({ isUser, computationId }));
  const computationModule = data?.payload;

  const { data: resultsData, isLoading, refetch: refetchGraphicData, isFetching } = useQuery<
    APIResponse<ComputationGraphicOptions>
  >(
    getComputationGraphicDataKey({
      computationResultId: data?.payload?.computationResultId as ID,
      isUser,
    }),
    { retry: 0, refetchOnMount: false, enabled: !!data?.payload?.computationResultId },
  );
  return (
    <LayoutWithSidebar
      breadcrumbs={[
        { label: 'Submissions' },
        {
          label: isUser ? 'Functional Module Computations' : 'Module Computation',
          href: isUser
            ? `/orders/modules?status=${computationModule?.status}`
            : `/computations?status=${computationModule?.status}`,
        },
        { label: 'Functional Module Computations Details' },
      ]}
    >
      <Head
        title={`${computationModule?.computationModuleTitle} - Functional Module Computation Details`}
      />
      {computationModule && (
        <div className="grid gap-4 grid-cols-4">
          <div className={computationModule.declineReason ? 'col-span-3' : 'col-span-4'}>
            <div className="flex justify-between">
              <Typography as="h1" variant="h300" color="secondaryDarkBlue" mb={1}>
                Computation Request Details
              </Typography>
              {!isUser && <StatusButtons status={computationModule.status} />}
            </div>
            <ComputationsInformation computationModule={computationModule} />
            <ComputationDescription
              computationModule={computationModule}
              resultsData={resultsData?.payload}
            />
            {resultsData && (
              <ComputationsChart
                resultsData={resultsData?.payload}
                isLoading={isLoading}
                refetchGraphicData={refetchGraphicData}
                isFetching={isFetching}
              />
            )}
          </div>
          {computationModule.declineReason && (
            <div>
              <RejectSection declineReason={computationModule.declineReason} />
            </div>
          )}
        </div>
      )}
    </LayoutWithSidebar>
  );
};

ComputationDetailsImpl.getInitialProps = async ctx => {
  const props = {
    computationId: ctx.query.computationId?.toString() ?? '',
  };

  if (!ctx.req) return props;

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  const data = await queryCache.fetchQuery<APIResponse<CurrentUser>>(
    getCurrentUserQueryKey(),
    fetcher,
  );
  const isUser = data?.payload?.role === 'user';

  await queryCache.fetchQuery(
    getComputationKey({ computationId: props.computationId, isUser }),
    fetcher,
  );

  return { ...props, ...getDehydratedProps() };
};

export const AdminComputationDetailsPage = withPageAuth({
  roles: ['admin', 'editor'],
})(ComputationDetailsImpl);

export const UserComputationDetailsPage = withPageAuth({
  roles: ['user'],
})(ComputationDetailsImpl);
