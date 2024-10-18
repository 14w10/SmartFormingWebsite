import { AppProps } from 'next/app';
import smoothscroll from 'smoothscroll-polyfill';
import { ThemeProvider } from 'styled-components';

import { GlobalStyles, theme } from '@smar/ui';

import { LayoutDefault } from 'features/layout';

if (process.browser) {
  smoothscroll.polyfill();
}

export const App = ({ Component, pageProps }: AppProps) => {
  const Layout = (Component as any).Layout || LayoutDefault;

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <GlobalStyles />
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
};
