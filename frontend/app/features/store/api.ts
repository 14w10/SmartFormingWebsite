import { apiClient } from 'libs/api';

export const getComputationModulesQueryKey = (
  params?: {
    per?: number;
    search?: string;
    order?: 'asc' | 'desc';
    sort?: string;
    category?: 'medicine' | 'hybrid_tech' | 'energy' | 'medicine' | 'manufacturing';
    categoryId?: string;
    onMainPage?: boolean;
  } & Record<string, any>,
) => {
  return [
    '/store/computation_modules',
    {
      per: 16,
      search: '',
      status: 'new',
      ...params,
    },
  ];
};

export const getCategoriesQueryKey = (params?: any) => ['/store/categories', params];

export const getComputationModuleQueryKey = (params: { moduleId: ID }) => [
  '/store/computation_modules/[moduleId]',
  params,
];

export const getPortfolioModuleQueryKey = (params: { moduleId: ID }) => [
  '/store/computation_modules/[moduleId]/portfolio_modules',
  params,
];

export const downloadRequestReq = (values: { portfolioModuleId?: ID; authorId?: ID }) =>
  apiClient.post('/store/portfolio_requests', {
    portfolioRequest: values,
  });

export const getStorePortfoliosQueryKey = (params: Record<string, any>) => [
  '/store/portfolio_modules',
  {
    per: 25,
    search: '',
    status: 'new',
    ...params,
  },
];
