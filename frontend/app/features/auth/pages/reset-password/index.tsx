import { useRouter } from 'next/router';

import { withPageAuth } from 'features/auth/hocs';
import { Head } from 'features/layout';

import { AuthWrapper } from '../../templates/auth-wrapper';
import { ResetPasswordForm } from './form';

const ResetPassword = () => {
  const { query } = useRouter();

  return (
    <>
      <Head title="Reset password" />
      <AuthWrapper>
        <ResetPasswordForm token={query?.token as string} />
      </AuthWrapper>
    </>
  );
};

export const ResetPasswordPage = withPageAuth({ pageType: 'publicOnly' }, () => '/')(ResetPassword);
