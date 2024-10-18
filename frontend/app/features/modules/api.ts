import { apiClient } from 'libs/api';

export const changeStatusReq = ({
  moduleId,
  status,
  ...data
}: {
  moduleId: ID;
  status: ModuleStatus;
  rejectReason?: string;
  uid?: string;
}) =>
  apiClient.put(`/admin/computation_modules/${moduleId}`, {
    computationModule: { status, ...data },
  });

export const editModuleReq = ({
  moduleId,
  isUser,
  ...data
}: Module & { moduleId: ID; isUser: boolean }) =>
  apiClient.put(`${!isUser ? '/admin' : ''}/computation_modules/${moduleId}`, {
    computationModule: data,
  });

export const createModuleReq = (values: any) =>
  apiClient.post('/computation_modules', {
    computationModule: values,
  });

export const duplicateModuleReq = (moduleId: ID) =>
  apiClient.post(`/admin/computation_modules/${moduleId}/copy`);

export const deleteModuleReq = (moduleId: ID) =>
  apiClient.delete(`/admin/computation_modules/${moduleId}`);

export const getModuleQueryKey = ({ isUser, ...params }: { moduleId: ID; isUser?: boolean }) => [
  `${!isUser ? '/admin' : ''}/computation_modules/[moduleId]`,
  params,
];

export const getModulesQueryKey = ({
  isUser,
  ...params
}: {
  status: string;
  per: number;
  isUser?: boolean;
}) => [`${!isUser ? '/admin' : ''}/computation_modules`, params];
