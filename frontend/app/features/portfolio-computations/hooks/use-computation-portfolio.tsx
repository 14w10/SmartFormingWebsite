import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import { getComputationFormQueryKey } from 'features/module-computation-form/api';
import { getPortfolioQueryKey } from 'features/portfolios';
import { getComputationModuleQueryKey } from 'features/store';
import { useCurrentUser } from 'features/user';

export const useComputationPortfolioForm = () => {
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const { data: portfolio } = useQuery<APIResponse<Portfolio>>(
    getPortfolioQueryKey({
      isUser: currentUser?.role === 'user',
      portfolioId: query.portfolioId as ID,
    }),
  );

  const activeModule = query.module ? parseInt(query.module as string) : 0;

  const activeModuleId = useMemo(
    () =>
      ((activeModule || activeModule === 0) &&
        portfolio?.payload.portfolioComputationModules?.[activeModule].computationModule.id) ??
      0,
    [activeModule, portfolio?.payload.portfolioComputationModules],
  );

  const activeFormId = useMemo(
    () =>
      ((activeModule || activeModule === 0) &&
        portfolio?.payload.portfolioComputationModules?.[activeModule].computationModule
          .computationFormId) ??
      0,
    [activeModule, portfolio?.payload.portfolioComputationModules],
  );

  const { data: computationModule } = useQuery<ComputationModuleDTO>(
    getComputationModuleQueryKey({
      moduleId: activeModuleId as ID,
    }),
    {
      refetchOnWindowFocus: false,
      enabled: !!activeModuleId,
    },
  );

  const { data: computationForm } = useQuery<ComputationFormDTO>(
    getComputationFormQueryKey({ formId: activeFormId as ID }),
    { refetchOnWindowFocus: false, enabled: !!activeFormId },
  );

  const countPreModules = useMemo(
    () =>
      portfolio?.payload.portfolioComputationModules.filter(
        item => item.computationModule.moduleType === 'pre-fe',
      ).length || 0,
    [portfolio?.payload.portfolioComputationModules],
  );

  return { computationModule, computationForm, portfolio, countPreModules };
};
