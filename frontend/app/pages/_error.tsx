import { NextPage } from 'next';

import { ErrorPage as Error } from 'features/layout';

const ErrorPage: NextPage<{ statusCode: number }> = ({ statusCode }) => {
  return <Error statusCode={statusCode} />;
};

ErrorPage.getInitialProps = async ctx => {
  const statusCode = ctx.err?.statusCode || ctx.res?.statusCode || 500;

  if (ctx.res) {
    ctx.res.statusCode = statusCode;
  }

  return { statusCode };
};

export default ErrorPage;
