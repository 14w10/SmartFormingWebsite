import { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { useConfirmModal } from '@smar/ui';

import { getAdminCategoriesQueryKey, removeCategoryReq } from '../api';

export const RemoveCategory = ({ categoryId }: { categoryId: string }) => {
  const { confirm } = useConfirmModal();
  const queryCache = useQueryClient();
  const { mutateAsync, error } = useMutation(removeCategoryReq, {
    onSuccess: () => {
      queryCache.invalidateQueries(getAdminCategoriesQueryKey());
    },
  });

  const handleRemove = useCallback(() => {
    confirm('Are you sure that you want to remove the category?', async () => {
      return mutateAsync(categoryId);
    });
  }, [categoryId, confirm, mutateAsync]);

  return (
    <>
      <button
        className="v-text130 text-auxiliaryRed900 outline-none hover:opacity-75 delay-100"
        onClick={handleRemove}
      >
        Remove
      </button>
    </>
  );
};
