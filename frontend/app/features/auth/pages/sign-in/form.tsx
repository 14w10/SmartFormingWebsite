import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { Button, FormField, Input, Typography } from '@smar/ui';

import { loginReq } from '../../api';
import { LoginFields, validationSchema } from './validation-schema';

// export function useYupForm<Schema extends yup.ObjectSchema<any>, Context = unknown>(
//   props: Exclude<UseFormProps<yup.InferType<Schema>, Context>, "resolver"> & {
//     schema: Schema;
//   }
// ): UseFormReturn<yup.InferType<Schema>, Context> {
//   return useForm<yup.InferType<Schema>, Context>({
//     ...props,
//     resolver: yupResolver(props.schema),
//   });
// }


export const Form = () => {
  const methods = useForm<LoginFields>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      // This is correctly typed as a string
      email: "",
      password: "",
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate: login, isError } = useMutation<any, APIError, LoginFields>(loginReq, {
    onSuccess: () => {
      location.href = '/';
    },
    onError: (error) => {
      console.error(error); // Handle error more specifically if necessary
    },
  });

  const onSubmit = (data: LoginFields) => {
    try {
      console.log("This is Login data: ", data);
      if (data) login(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <FormField component={Input} className="mb-2" label="Email *" type="email" name="email" />
        <FormField
          component={Input}
          className="mb-2"
          type="password"
          name="password"
          label="Password *"
        />

        <Link href="/forgot-password" passHref>
          <Typography as="a" variant="label140" color="secondaryDarkBlue920" my={1}>
            Forgot password?
          </Typography>
        </Link>
        <div className="relative mt-2 pt-2">
          {isError && (
            <p
              className="text-auxiliaryRed900 absolute left-0 right-0 text-center text-sm leading-none"
              style={{ top: -20 }}
            >
              Your username and password are incorrect - please try again.
            </p>
          )}
          <Button type="submit" className="p-12px w-full" disabled={isSubmitting}>
            Log in
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
