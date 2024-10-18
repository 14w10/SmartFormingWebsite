import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button, FormField, Input, Typography } from '@smar/ui';

import { redirect } from 'libs/redirect';

import { resetPasswordReq } from '../../api';
import { validationSchema } from './validation-schema';

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { mutate: resetPassword } = useMutation(resetPasswordReq, {
    onSuccess: () => {
      redirect(null, '/sign-in');
    },
  });

  const onSubmit = useCallback(
    (values: any) => {
      resetPassword({ resetPasswordToken: token, ...values });
    },
    [resetPassword, token],
  );

  return (
    <>
      <Typography variant="h200" color="secondaryDarkBlue900" mb={3}>
        Reset Password
      </Typography>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
          <input type="hidden" value={token} />
          <FormField
            component={Input}
            className="mb-2"
            type="password"
            name="password"
            label="New Password *"
          />
          <FormField
            component={Input}
            className="mb-2"
            type="password"
            name="passwordConfirmation"
            label="Confirm New Password *"
          />
          <Button type="submit" className="mt-2" disabled={methods.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </FormProvider>
      <div className="mt-2 text-center">
        <Link href="/sign-in" passHref>
          <Typography
            as="a"
            variant="label140"
            color="secondaryDarkBlue900"
            fontWeight="bold"
            textAlign="center"
          >
            Or Login here
          </Typography>
        </Link>
      </div>
    </>
  );
};
