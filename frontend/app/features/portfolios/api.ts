import { apiClient } from 'libs/api';

export const createPortfolioReq = ({ portfolioModule }: { portfolioModule: any }) =>
  apiClient.post('/admin/portfolio_modules', { portfolioModule });

export const changeStatusReq = ({
  portfolioId,
  ...values
}: {
  portfolioId: ID;
  rejectReason?: string;
  status: string;
}) =>
  apiClient.put(`/admin/portfolio_modules/${portfolioId}`, {
    portfolioModule: values,
  });

export const getPortfoliosQueryKey = ({
  isUser,
  per = 25,
  status = 'new',
  ...params
}: {
  status?: string;
  per?: number;
  isUser?: boolean;
}) => [`${!isUser ? '/admin' : ''}/portfolio_modules`, { per, status, ...params }];

export const getPortfolioQueryKey = ({
  isUser,
  ...params
}: {
  isUser?: boolean;
  portfolioId: ID;
}) => [`${!isUser ? '/admin' : '/store'}/portfolio_modules/[portfolioId]`, params];
