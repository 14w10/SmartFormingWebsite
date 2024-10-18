import Link from 'next/link';

import { Typography } from '@smar/ui';

import { withPageAuth } from 'features/auth/hocs';

import { AuthWrapper } from '../../templates/auth-wrapper';
import { Form } from './form';

const SignUp = () => {
  return (
    <AuthWrapper>
      <Typography variant="h200" color="secondaryDarkBlue900" mb={3}>
        Sign up to Smart Forming
      </Typography>
      <Form />
      <Typography variant="label140" color="secondaryDarkBlue900" textAlign="center" mt={2}>
        Already have an account?{' '}
        <Link href="/sign-in" passHref>
          <Typography as="a" variant="label140" color="secondaryDarkBlue900" fontWeight="bold">
            Log In
          </Typography>
        </Link>
      </Typography>
    </AuthWrapper>
  );
};

export const SignUpPage = withPageAuth({ pageType: 'publicOnly' }, () => '/')(SignUp);
