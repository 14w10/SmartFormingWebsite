import { apiClient } from 'libs/api';

export const getComputationFormQueryKey = (params: { formId: ID }) => [
  '/store/computation_forms/[formId]',
  params,
];

// TODO: fix types
export const sendComputationFormReq = (values: any) =>
  apiClient.post('/store/computation_requests', values);

// TODO: fix types
export const validateComputationFormReq = (values: any) =>
  apiClient.post('/forms/validations', values);
