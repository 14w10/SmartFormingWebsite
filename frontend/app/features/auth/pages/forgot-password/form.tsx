import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button, FormField, Input } from '@smar/ui';

import { validationSchema } from './validation-schema';

export const Form = ({ onSubmit }: { onSubmit: (values: { email: string }) => void }) => {
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <FormField component={Input} className="mb-2" type="email" name="email" label="Email *" />
        <Button type="submit" className="mt-2" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};
