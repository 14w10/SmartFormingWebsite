import { useQuery } from 'react-query';

import { getCategoriesQueryKey, getComputationModulesQueryKey } from './api';

export const useModules = () => {
  const allCategories = useQuery<APIListResponse<Category>>(getCategoriesQueryKey(), {
    onError: () => null,
  });
  const allModules = useQuery<ComputationModulesDTO>(getComputationModulesQueryKey({ per: 8 }), {
    onError: () => null,
  });

  const popularModules = useQuery<ComputationModulesDTO>(
    getComputationModulesQueryKey({ per: 8 }),
    {
      onError: () => null,
    },
  );

  return {
    popularModules,
    allModules,
    allCategories,
  };
};
