export const getCurrentUserQueryKey = () => ['/sessions'];

export const getUserListQueryKey = (params: any) => ['/admin/users', { per: 25, ...params }];

export const getUserQueryKey = (params: { userId: ID }) => ['/admin/users/[userId]', params];
