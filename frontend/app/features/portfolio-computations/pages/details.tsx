import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar } from 'features/layout';
import { PortfolioDescription } from 'features/store/molecules/portfolio/portfolio-description';
import { PortfolioInformation } from 'features/store/molecules/portfolio/portfolio-information';
import { useCurrentUser } from 'features/user';

import { getPortfolioRequestKey } from '../api';
import { Composition } from '../organisms/composition';

const PortfolioComputationDetails = () => {
  const { query } = useRouter();

  const { currentUser } = useCurrentUser();

  const isUser = currentUser && currentUser.role === 'user';
  const { data, isLoading } = useQuery<APIResponse<PortfolioRequest>>(
    getPortfolioRequestKey({
      isUser,
      portfolioId: query.portfolioId as ID,
    }),
  );

  const portfolioComputations = useMemo(() => {
    const preModules =
      (data?.payload?.portfolioModule?.computationModulesArray['pre-fe'] || []).map(
        id =>
          data?.payload?.portfolioComputationRequests.find(
            item => item.computationModuleId === id,
          ) as Computation,
      ) || [];
    const postModules =
      (data?.payload?.portfolioModule?.computationModulesArray['post-fe'] || []).map(
        id =>
          data?.payload?.portfolioComputationRequests.find(
            item => item.computationModuleId === id,
          ) as Computation,
      ) || [];
    return [...preModules, ...postModules];
  }, [data?.payload?.portfolioComputationRequests, data?.payload?.portfolioModule]);
  return (
    <LayoutWithSidebar
      breadcrumbs={[
        { label: 'Store' },
        {
          href: '/store/portfolios',
          label: 'Portfolios',
        },
        { label: data?.payload.title || 'Portfolio Computations Details' },
      ]}
    >
      <Head title="Portfolio Computations Details" />
      <div className="grid grid-cols-4">
        <div className="col-span-3">
          <div className="flex justify-between mb-1">
            <h1 className="v-h300 text-secondaryDarkBlue900">Portfolio Computations Details</h1>
          </div>
          {isLoading
            ? 'loading...'
            : data?.payload && (
                <>
                  <PortfolioInformation portfolioModule={data.payload} />
                  <PortfolioDescription portfolioModule={data.payload} />
                  <Composition portfolioComputations={portfolioComputations} />
                </>
              )}
        </div>
      </div>
    </LayoutWithSidebar>
  );
};

export const AdminPortfolioComputationDetails = withPageAuth({
  roles: ['admin', 'editor'],
})(PortfolioComputationDetails);

export const UserPortfolioComputationDetails = withPageAuth({ roles: ['user'] })(
  PortfolioComputationDetails,
);
