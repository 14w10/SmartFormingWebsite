import { useMutation, useQuery, useQueryClient } from 'react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button } from '@smar/ui';

import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar } from 'features/layout';
import { changeStatusReq, getPortfolioRequestKey } from 'features/portfolio-computations/api';
import { getPortfolioQueryKey } from 'features/portfolios';
import { StatusButtons } from 'features/portfolios/organisms/status-buttons';
import { useCurrentUser } from 'features/user';

import { Composition } from '../molecules/portfolio/composition';
import { PortfolioDescription } from '../molecules/portfolio/portfolio-description';
import { PortfolioInformation } from '../molecules/portfolio/portfolio-information';

const PortfolioDetails = () => {
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const queryCache = useQueryClient();
  const isUser = currentUser?.role === 'user';

  const { data, isLoading } = useQuery<APIResponse<Portfolio>>(
    getPortfolioQueryKey({
      isUser: !currentUser || isUser,
      portfolioId: query.portfolioId as ID,
    }),
  );

  return (
    <LayoutWithSidebar
      breadcrumbs={[
        { label: 'Store' },
        {
          href: '/store/portfolios',
          label: 'Portfolios',
        },
        { label: data?.payload.title || 'Portfolio Details' },
      ]}
    >
      <Head title="Portfolio Details" />
      <div className="grid grid-cols-4">
        <div className="col-span-3">
          <div className="flex justify-between mb-1">
            <h1 className="v-h300 text-secondaryDarkBlue900">Portfolio Details</h1>
            {isUser ? (
              <Link href={`/store/portfolios/${query.portfolioId}/computation-form`} passHref>
                <Button as="a">request computation</Button>
              </Link>
            ) : (
              data?.payload && <StatusButtons portfolio={data?.payload} />
            )}
          </div>
          {isLoading
            ? 'loading...'
            : data?.payload && (
                <>
                  <PortfolioInformation portfolioModule={data.payload} />
                  <PortfolioDescription portfolioModule={data.payload} />
                  <Composition portfolioModule={data.payload} />
                </>
              )}
        </div>
      </div>
    </LayoutWithSidebar>
  );
};

export const PortfolioDetailsPage = withPageAuth([{ roles: ['user'] }, { pageType: 'publicOnly' }])(
  PortfolioDetails,
);

export const AdminPortfolioDetailsPage = withPageAuth([{ roles: ['admin', 'user'] }])(
  PortfolioDetails,
);
