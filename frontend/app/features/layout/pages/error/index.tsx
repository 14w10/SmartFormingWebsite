import { FC, ReactNode } from 'react';
import Link from 'next/link';

import { Button } from '@smar/ui';

import { Head } from '../../organisms/head';

type ErrorMessages = {
  title: string;
  message: string;
};

const statusCodes: Record<number, ErrorMessages> = {
  403: {
    title: 'Forbidden',
    message: "You don't have permission to see this content",
  },
  404: {
    title: 'Not found',
    message: 'Sorry, the page you were looking for doesn’t exist at this URL.',
  },
  500: { title: 'Error', message: 'Internal Server Error' },
};

export const ErrorPage: FC<{ statusCode: number; children?: ReactNode }> = ({ statusCode, children }) => {
  const msgs = statusCodes[statusCode] || statusCodes[500];

  return (
    <>
      <Head title={msgs.title} />
      <div className="min-h-screen flex flex-col m-auto text-center items-center justify-center p-3">
        <h1 className="text-8xl">{statusCode}</h1>
        <h3 className="text-3xl mb-1">{msgs.title}</h3>
        <p>{msgs.message}</p>
        <Link href="/" passHref>
          <Button as="a" className="mt-3">
            Go Home
          </Button>
        </Link>
        {children}
      </div>
    </>
  );
};
