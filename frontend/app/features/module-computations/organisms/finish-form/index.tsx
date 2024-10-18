import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, FormField } from '@smar/ui';

import { UploadFile } from 'features/upload-file';
import { Accept } from 'react-dropzone';

interface FormValues {
  attachFile: File;
}

interface IReasonForm {
  handleClose: () => void;
  handleChangeStatus: (newStatus: Computation['status'], data?: any) => void;
}

const acceptType: Accept = {
  'application/zip': ['.zip']
}

export const FinishForm = ({ handleClose, handleChangeStatus }: IReasonForm) => {
  const methods = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async ({ attachFile }: FormValues) => {
      const attachmentsAttributes = [
        {
          fileType: 'computationRequestResult',
          file: attachFile,
        },
      ];
      await handleChangeStatus('finished', { attachmentsAttributes });
      handleClose();
    },
    [handleChangeStatus, handleClose],
  );
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col">
        <FormField
          controlled
          component={UploadFile}
          name="attachFile"
          label="Result File (.zip format)"
          accept={acceptType}
          rules={{ required: { message: 'Field is required', value: true } }}
        />

        <div className="relative mt-2 flex justify-end">
          <Button className="mr-2" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Finish
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
