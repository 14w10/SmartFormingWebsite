import { apiClient } from 'libs/api';

export const getAdminCategoriesQueryKey = (params?: any) => ['/admin/categories', params];

export const addCategoryReq = (category: { name: string; icon: any }) =>
  apiClient.post(`/admin/categories`, { category });

export const updateCategoryReq = ({ id, ...category }: UpdateCategoryInput) =>
  apiClient.put(`/admin/categories/${id}`, { category });

export const removeCategoryReq = (id: string) => apiClient.delete(`/admin/categories/${id}`);
