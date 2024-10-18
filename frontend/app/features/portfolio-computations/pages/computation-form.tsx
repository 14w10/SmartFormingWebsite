import { useCallback, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { createQueryPrefetcher } from 'libs/react-query';
import { redirect } from 'libs/redirect';
import { withPageAuth } from 'features/auth';
import { LayoutWithSidebar } from 'features/layout';
import { ComputationProvider } from 'features/module-computation-form';
import { getComputationModuleQueryKey } from 'features/store';

import { useComputationPortfolioForm } from '../hooks/use-computation-portfolio';
import { ComputationForm } from '../organisms/computation-component';
import { ComputationDetails } from '../organisms/computation-details';
import { ModuleProgress } from '../organisms/module-progress';
import { UploadStep } from '../organisms/upload-step';

const ComputationFormImpl: NextPage<{
  portfolioId: ID;
}> = () => {
  const [moduleIds, moduleIdsSet] = useState<ID[]>([]);
  const addModuleId = useCallback((id: ID) => {
    moduleIdsSet(prev => [...prev, id]);
  }, []);

  const { portfolio, computationForm } = useComputationPortfolioForm();
  const { query } = useRouter();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Store' },
      {
        href: '/store/portfolios',
        label: 'Portfolios',
      },
      {
        label: 'Portfolio Details',
        href: `/store/portfolios/${query.portfolioId}`,
      },
      { label: 'Computation Form' },
    ],
    [query.portfolioId],
  );

  return (
    <LayoutWithSidebar breadcrumbs={breadcrumbs}>
      <h1 className="v-h300 text-secondaryDarkBlue900">Portfolio computation</h1>
      {portfolio?.payload && (
        <ModuleProgress modules={portfolio?.payload?.portfolioComputationModules} />
      )}
      {query.upload ? (
        <UploadStep />
      ) : query.computationId ? (
        <ComputationDetails moduleIds={moduleIds} />
      ) : (
        <ComputationProvider
          payload={computationForm?.payload}
          computationFormMeta={computationForm?.meta}
          isPortfolio
        >
          <ComputationForm addModuleId={addModuleId} />
        </ComputationProvider>
      )}
    </LayoutWithSidebar>
  );
};

ComputationFormImpl.getInitialProps = async ctx => {
  const props = {
    portfolioId: ctx.query.portfolioId?.toString() ?? '',
  };

  if (!ctx.req) return props;

  if (Object.keys(ctx.query).length > 1) {
    redirect(ctx, `/store/portfolios/${props.portfolioId}/computation-form`);
  }

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await Promise.all([
    queryCache.fetchQuery(getComputationModuleQueryKey({ moduleId: props.portfolioId }), fetcher),
  ]);

  return { ...props, ...getDehydratedProps() };
};

export const ComputationFormPage = withPageAuth({ roles: ['user'] })(ComputationFormImpl);
