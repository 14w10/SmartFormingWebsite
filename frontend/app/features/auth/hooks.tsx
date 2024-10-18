import { useMemo } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { redirect } from 'libs/redirect';
import { useCurrentUser } from 'features/user';

import { logout } from './api';
import { checkAuth } from './helpers';
import { AuthParams } from './types';

export const useCheckAuth = (authParams: AuthParams) => {
  const { currentUser, isLoaded } = useCurrentUser();

  return useMemo(
    () => ({
      isPermitted: checkAuth(authParams, currentUser),
      isLoaded,
    }),
    [authParams, currentUser, isLoaded],
  );
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation(logout, {
    onSuccess: () => {
      queryClient.clear();
      redirect(null, '/sign-in');
    },
  });
};
