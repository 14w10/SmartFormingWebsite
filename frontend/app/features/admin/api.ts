import { apiClient } from 'libs/api';

export const getAdminListQueryKey = (params: any) => ['/admin/admins', { per: 25, ...params }];

export const createAdminReq = (admin: { firstName: string; lastName: string; email: string }) =>
  apiClient.post('/admin/admins', { admin });
