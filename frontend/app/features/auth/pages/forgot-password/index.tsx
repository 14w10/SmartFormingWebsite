import { useState } from 'react';
import { useMutation } from 'react-query';
import Link from 'next/link';

import { Button, Typography } from '@smar/ui';

import { withPageAuth } from 'features/auth/hocs';
import { Head } from 'features/layout';

import { forgotPasswordReq } from '../../api';
import { AuthWrapper } from '../../templates/auth-wrapper';
import { Form } from './form';

const ForgotPassword = () => {
  const [confirmForm, setConfirmForm] = useState(false);
  const { mutate: forgotPassword } = useMutation(forgotPasswordReq, {
    onSuccess: () => {
      setConfirmForm(true);
    },
  });

  return (
    <>
      <Head title="Forgot password" />
      <AuthWrapper>
        {confirmForm ? (
          <div className="text-center">
            <Typography variant="label140" component="h3">
              Thank you! We'll email you shortly
            </Typography>
            <div>
              <Link href="/sign-in" passHref>
                <Button as="a" variant="outlined" className="mt-2">
                  go to login page
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <Typography variant="h200" color="secondaryDarkBlue900" mb={3}>
              Forgot Password
            </Typography>
            <Form onSubmit={forgotPassword} />
            <Typography variant="label140" color="secondaryDarkBlue900" textAlign="center" mt={2}>
              Or{' '}
              <Link href="/sign-in" passHref>
                <Typography
                  as="a"
                  variant="label140"
                  color="secondaryDarkBlue900"
                  fontWeight="bold"
                >
                  Log In
                </Typography>
              </Link>{' '}
              here
            </Typography>
          </>
        )}
      </AuthWrapper>
    </>
  );
};

export const ForgotPasswordPage = withPageAuth(
  { pageType: 'publicOnly' },
  () => '/',
)(ForgotPassword);
