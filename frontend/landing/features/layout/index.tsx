import { FC } from 'react';
import Head from 'next/head';

import { favicon } from './favicon';

export const LayoutDefault: FC = ({ children }) => (
  <>
    <Head>
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="format-detection" content="telephone=no" />
      {/* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" /> */}
      <meta name="viewport" content="width=1280, initial-scale=1, maximum-scale=5" />
      <title>SmartForming | Join the knowledge movement</title>
      <meta name="description" content="" />
      {favicon}
    </Head>

    <main>{children}</main>
  </>
);
