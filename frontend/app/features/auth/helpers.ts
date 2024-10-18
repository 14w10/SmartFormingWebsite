import { AuthParams } from './types';

const matchRoles = (roles: UserRole[] = [], usr: CurrentUser) =>
  roles.length > 0 ? !!usr && roles.includes(usr.role) : true;

export const checkAuth = (authParams: AuthParams, currentUser: CurrentUser) => {
  const normalizedParams = Array.isArray(authParams) ? authParams : [authParams];

  return normalizedParams.some(params => {
    if (params.pageType === 'publicOnly') {
      return currentUser ? false : true;
    }

    const isLoggedIn = !!currentUser?.id;

    return isLoggedIn && matchRoles(params.roles, currentUser);
  });
};
