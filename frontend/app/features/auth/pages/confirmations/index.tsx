import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button } from '@smar/ui';

import { confirmReq } from '../../api';
import { AuthWrapper } from '../../templates/auth-wrapper';

export const Confirmation: NextPage = () => {
  const [loading, loadingSet] = useState(true);
  const { mutate: confirmEmail, error } = useMutation(confirmReq, {
    onSettled: () => loadingSet(false),
  });
  const { query } = useRouter();

  useEffect(() => {
    query.token && confirmEmail({ token: query.token as string });
  }, [confirmEmail, query.token]);

  return (
    <AuthWrapper>
      <p className="v-h200 text-secondaryDarkBlue900 mb-3">Confirmation e-mail</p>
      <div>
        <p className="v-p130">
          {!loading && (error ? 'Token is missing' : 'Thank you! Your email confirmed.')}
        </p>
        <Link href="/sign-in" passHref>
          <Button as="a" variant="outlined" className="mt-2">
            go to login page
          </Button>
        </Link>
      </div>
    </AuthWrapper>
  );
};
