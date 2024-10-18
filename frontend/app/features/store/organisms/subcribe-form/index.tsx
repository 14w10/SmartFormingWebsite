import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button, FormField, Input } from '@smar/ui';

import { validationSchema } from './validation-schema';

export const SubscribeForm = () => {
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <div className="my-15 grid grid-cols-12">
      <div className="rounded-2x-large flex flex-col gap-4 col-span-10 col-start-2 items-center p-6 bg-white xl:flex-row">
        <div>
          <h2 className="v-h300">Subscribe to our newsletter</h2>
          <p className="v-sub170">Stay updated about the latest news and our products</p>
        </div>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(() => null)}
            className="flex flex-col items-center w-full xl:w-7/12"
          >
            <div className="flex gap-4 w-full">
              <FormField component={Input} className="w-full" type="email" name="email" />
              <Button
                type="submit"
                className="p-12px flex-shrink-0"
                disabled={isSubmitting}
                size="md"
              >
                Subscribe
              </Button>
            </div>

            {false && (
              <p className="text-auxiliaryRed900 text-center text-sm leading-none">Error</p>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
