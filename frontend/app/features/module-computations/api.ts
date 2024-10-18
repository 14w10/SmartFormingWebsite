import { apiClient } from 'libs/api';

export const changeStatusReq = ({
  computationId,
  status,
  ...data
}: {
  computationId: ID;
  status: Computation['status'];
  declineReason?: string;
}) =>
  apiClient.put(`/admin/computation_requests/${computationId}`, {
    computationRequest: { status, ...data },
  });

export const saveChartParamsReq = ({
  computationResultId,
  parameters,
}: {
  computationResultId: ID;
  parameters: any;
}) =>
  apiClient.put(`/admin/computation_results/${computationResultId}`, {
    computation_result: { parameters },
  });

export const getComputationsKey = ({
  isUser,
  per = 25,
  status = 'new',
  ...params
}: {
  per?: number;
  status?: string;
  isUser?: boolean;
}) => [`${!isUser ? '/admin' : '/orders'}/computation_requests`, { status, per, ...params }];

export const getComputationKey = ({
  isUser,
  ...params
}: {
  isUser?: boolean;
  computationId: ID;
}) => [`${!isUser ? '/admin' : '/orders'}/computation_requests/[computationId]`, params];

export const getComputationGraphicDataKey = ({
  isUser,
  ...params
}: {
  isUser?: boolean;
  computationResultId: ID;
}) => [`${!isUser ? '/admin' : '/orders'}/computation_results/[computationResultId]`, params];
