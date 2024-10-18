import { apiClient } from 'libs/api';

export const getSignUpRequestListQueryKey = (params: any) => [
  '/admin/signups',
  { status: 'new', per: 25, ...params },
];

export const getSignUpRequestQueryKey = (params: { signUpId: ID }) => [
  '/admin/signups/[signUpId]',
  params,
];

export const updateStatusReq = async ({
  id,
  status,
  declineReason,
}: {
  id: string | number;
  status: string;
  declineReason?: string;
}) => apiClient.put(`/admin/signups/${id}`, { signup: { status, declineReason } });
