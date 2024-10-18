import { apiClient } from 'libs/api';

export const changeStatusReq = ({
  portfolioId,
  status,
  ...data
}: {
  portfolioId: ID;
  status: Computation['status'];
  declineReason?: string;
}) =>
  apiClient.put(`/admin/portfolio_requests/${portfolioId}`, {
    portfolioRequest: { status, ...data },
  });

export const getPortfolioRequestKey = ({
  isUser,
  ...params
}: {
  isUser?: boolean;
  portfolioId: ID;
}) => [`${!isUser ? '/admin' : '/orders'}/portfolio_requests/[portfolioId]`, params];

export const getPortfolioRequestsKey = ({
  isUser,
  per = 25,
  status = 'new',
  ...params
}: {
  per?: number;
  status?: string;
  isUser?: boolean;
}) => [`/${!isUser ? 'admin' : 'orders'}/portfolio_requests`, { status, per, ...params }];

export const sendComputationPortfolioFormReq = (values: any) =>
  apiClient.post(`/store/portfolio_computation_requests`, values);

export const getComputationsDetailsKey = ({ ...params }: { computationId: ID }) => [
  `/orders/portfolio_computation_requests/[computationId]`,
  params,
];

export const sendComputationPortfolioScopeFormReq = ({
  portfolioComputationRequestIds,
  portfolioId,
  authorId,
}: {
  portfolioId: ID;
  authorId: ID;
  portfolioComputationRequestIds: ID[];
}) =>
  apiClient.post(`/store/portfolio_modules/${portfolioId}/portfolio_requests`, {
    portfolioRequest: { portfolioComputationRequestIds, authorId },
  });
