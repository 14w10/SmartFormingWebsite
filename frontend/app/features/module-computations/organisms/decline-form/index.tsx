import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, FormField, Input } from '@smar/ui';

type DeclineFormProps = {
  handleClose: () => void;
  handleChangeStatus: (newStatus: Computation['status'], data?: { declineReason: string }) => void;
};

export const DeclineForm = ({ handleClose, handleChangeStatus }: DeclineFormProps) => {
  const methods = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    ({ declineReason }: { declineReason: string }) => {
      handleChangeStatus('declined', { declineReason });
      handleClose();
    },
    [handleChangeStatus, handleClose],
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col">
        <FormField
          as="textarea"
          component={Input}
          className="mb-2 resize-none"
          name="declineReason"
          label="Decline Reason *"
          rows={5}
          rules={{ required: { message: 'Filed is required', value: true } }}
        />

        <div className="relative flex justify-end mt-2">
          <Button className="mr-2" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Decline
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
