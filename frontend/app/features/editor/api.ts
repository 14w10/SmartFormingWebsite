import { apiClient } from 'libs/api';

export const getEditorListQueryKey = (params: any) => ['/admin/editors', { per: 25, ...params }];

export const createEditorReq = (editor: { firstName: string; lastName: string; email: string }) =>
  apiClient.post('/admin/editors', { editor });
