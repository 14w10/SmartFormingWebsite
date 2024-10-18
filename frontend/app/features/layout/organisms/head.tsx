import { FC, ReactNode } from 'react';
import NextHead from 'next/head';

import { favicon } from '../atoms/favicon';

export const HeadRoot = () => (
  <Head>
    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
    <title>Smart Forming</title>
    <meta name="description" content="" />
    {favicon}
  </Head>
);

export const Head: FC<{ title?: string; children?: ReactNode; }> = ({ title, children }) => (
  <NextHead>
    {title && <title>{title} | SmartForming</title>}
    {children}
  </NextHead>
);
