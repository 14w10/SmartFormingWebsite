import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

import { Button, FormField, Input, Modal, ModalCloseButton } from '@smar/ui';

import { setErrorsForForm } from 'libs/set-errors-for-form';
import { getAdminCategoriesQueryKey, updateCategoryReq } from 'features/categories/api';
import { SelectModules } from 'features/categories/molecules/select-modules';
import { getComputationModulesQueryKey } from 'features/store';

import { UploadIcon } from '../../molecules/upload-icon';

interface ErrorType {
  message: string;
}

const UpdateCategoryForm = ({
  name,
  icon,
  id,
  handleClose,
}: Category & { handleClose: () => void }) => {
  const methods = useForm({
    defaultValues: { name, ...(icon ? { icon: { preview: icon.url } } : {}) },
  });
  const queryCache = useQueryClient();

  const { mutateAsync, error } = useMutation(updateCategoryReq, {
    onSuccess: async () => {
      queryCache.invalidateQueries(getAdminCategoriesQueryKey());
      queryCache.invalidateQueries((getComputationModulesQueryKey as any)()[0]);
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = methods;

  const onSubmit = useCallback(
    ({
      icon,
      computationModulesAttributes,
      ...props
    }: {
      name: string;
      icon: any;
      computationModulesAttributes: { label: string; value: { id: string; onMainPage: boolean } }[];
    }) => {
      const iconData = icon.metadata ? { icon } : {};
      const data = {
        ...props,
        ...iconData,
        id,
        computationModulesAttributes: (computationModulesAttributes || []).map(item => ({
          ...item.value,
          id: parseFloat(item.value.id),
        })),
      };

      mutateAsync(data)
        .then(() => {
          handleClose();
        })
        .catch(({ errors }) => setErrorsForForm(errors.data.attributes, setError));
    },
    [handleClose, id, mutateAsync, setError],
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit as any)} className="w-full">
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-1/2">
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
          </div>
          <div className="w-1/2" style={{ minHeight: 280 }}>
            <FormField
              component={SelectModules}
              name="computationModulesAttributes"
              label="Pick modules"
              controlled
              categoryId={id}
            />
          </div>
        </div>
        {error as ErrorType && <p className="v-p130 text-auxiliaryRed900">{(error as ErrorType).message}</p>}
        <div className="relative flex justify-end">
          <Button className="mr-2" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export const UpdateCategory = (props: Category) => {
  const [isOpen, isOpenSet] = useState(false);
  const handleClose = useCallback(() => isOpenSet(false), []);

  return (
    <>
      <button
        className="v-text130 text-primaryBlue900 outline-none hover:opacity-75 delay-100"
        onClick={() => isOpenSet(true)}
      >
        Update
      </button>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={handleClose}>
          <div
            className="shadow-shadow4 rounded-large p-3 max-w-full bg-white"
            style={{ width: 600 }}
          >
            <div className="flex items-center">
              <h3 className="text-secondaryDarkBlue900 v-text110">Update category</h3>
              <ModalCloseButton onClick={handleClose} />
            </div>
            <div className="flex gap-2 mt-2">
              <UpdateCategoryForm {...props} handleClose={handleClose} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
