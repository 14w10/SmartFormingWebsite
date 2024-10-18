import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

import { Button, FormField, Input, Modal, ModalCloseButton } from '@smar/ui';

import { setErrorsForForm } from 'libs/set-errors-for-form';
import { addCategoryReq, getAdminCategoriesQueryKey } from 'features/categories/api';

import { UploadIcon } from '../../molecules/upload-icon';

export const CreateCategory = () => {
  const [isOpen, isOpenSet] = useState(false);
  const handleClose = useCallback(() => isOpenSet(false), []);
  const methods = useForm();
  const queryCache = useQueryClient();

  const { mutateAsync } = useMutation(addCategoryReq, {
    onSuccess: () => {
      queryCache.invalidateQueries(getAdminCategoriesQueryKey());
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = methods;

  const onSubmit = useCallback(
    (props: { name: string; icon: any }) => {
      mutateAsync(props)
        .then(() => {
          handleClose();
        })
        .catch(({ errors }) => setErrorsForForm(errors.data.attributes, setError));
    },
    [handleClose, mutateAsync, setError],
  );

  return (
    <>
      <Button size="md" onClick={() => isOpenSet(true)}>
        Add new category
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div
          className="shadow-shadow4 rounded-large p-3 max-w-full bg-white"
          style={{ width: 400 }}
        >
          <div className="flex items-center">
            <h3 className="text-secondaryDarkBlue900 v-text110">Create new category</h3>
            <ModalCloseButton onClick={handleClose} />
          </div>
          <div className="mt-2">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col gap-2">
                <FormField
                  component={Input}
                  name="name"
                  label="Name"
                  placeholder="Category name"
                  rules={{ required: { message: 'Filed is required', value: true } }}
                />
                <div>
                  <FormField
                    controlled
                    component={UploadIcon as any}
                    name="icon"
                    label="Icon"
                    rules={{ required: { message: 'Filed is required', value: true } }}
                  />
                </div>
                <div className="relative flex justify-end">
                  <Button className="mr-2" variant="outlined" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Create
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </Modal>
    </>
  );
};
