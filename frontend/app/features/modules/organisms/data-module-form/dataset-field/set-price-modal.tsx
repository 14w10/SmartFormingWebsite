import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Row } from '@tanstack/react-table';

import { Button, CheckboxField, FormField, Icon, Input, Modal, ModalCloseButton } from '@smar/ui';

export const SetPriceModal = ({
  selectionCount,
  handleSetPriceSelected,
  selectedRows,
}: {
  selectionCount: number;
  handleSetPriceSelected: (price: null | string, selectedRows: Row<DatasetAttachment>[]) => void;
  selectedRows: Row<any>[];
}) => {
  const [isOpen, isOpenSet] = useState(false);
  const handleClose = useCallback(() => isOpenSet(false), []);
  const methods = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = useCallback(
    ({ free, price }: { price: string; free: boolean }) => {
      handleSetPriceSelected(free ? null : price, selectedRows);
      handleClose();
      return;
    },
    [handleClose, handleSetPriceSelected, selectedRows],
  );

  useEffect(() => {
    return () => {
      if (!isOpen) {
        methods.reset();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <Button onClick={() => isOpenSet(true)} disabled={selectionCount === 0}>
        <Icon name="download" size={24} /> set a price ({selectionCount})
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div
          className="shadow-shadow4 rounded-large p-3 max-w-full bg-white"
          style={{ width: 400 }}
        >
          <div className="flex items-center">
            <h3 className="text-secondaryDarkBlue900 v-text110">set a price</h3>
            <ModalCloseButton onClick={handleClose} />
          </div>
          <div className="mt-2">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col gap-2">
                <FormField component={Input} name="price" label="Price" placeholder="Price" />
                <FormField component={CheckboxField} name="free" placeholder="Free" text="Free" />

                <div className="relative flex justify-end">
                  <Button className="mr-2" variant="outlined" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Update
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
