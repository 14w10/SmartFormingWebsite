import Link from 'next/link';

import { Typography } from '@smar/ui';

import { Head } from 'features/layout';

import { withPageAuth } from '../../hocs';
import { AuthWrapper } from '../../templates/auth-wrapper';
import { Form } from './form';

const SignIn = () => {
  return (
    <>
      <Head title="Sign in" />
      <AuthWrapper>
        <Typography variant="h200" color="secondaryDarkBlue900" mb={3}>
          Log in to your account
        </Typography>
        <Form />
        <Typography variant="label140" color="secondaryDarkBlue900" textAlign="center" mt={2}>
          Don’t have an account?{' '}
          <Link href="/sign-up" passHref>
            <Typography as="a" variant="label140" color="secondaryDarkBlue900" fontWeight="bold">
              Sign up here
            </Typography>
          </Link>
        </Typography>
      </AuthWrapper>
    </>
  );
};

export const SignInPage = withPageAuth({ pageType: 'publicOnly' }, () => '/')(SignIn);
