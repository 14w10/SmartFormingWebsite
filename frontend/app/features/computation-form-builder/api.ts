import { apiClient } from 'libs/api';

export const saveFormReq = ({
  computationFormId,
  form,
}: {
  computationFormId?: ID | null;
  form: any;
}) => {
  const currentApiClient = computationFormId ? apiClient.put : apiClient.post;
  return currentApiClient(`/admin/forms/builders/${computationFormId ?? ''}`, {
    form,
  });
};

export const getFormBuilderQueryKey = (params: { builderId: ID }) => [
  '/admin/forms/builders/[builderId]',
  params,
];
