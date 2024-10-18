import { AppProps } from 'next/app';
import smoothscroll from 'smoothscroll-polyfill';
import { ThemeProvider } from 'styled-components';

import { ConfirmModal, ConfirmModalProvider, GlobalStyles, theme } from '@smar/ui';

import { ReactQueryProvider } from 'libs/react-query';
import { CurrentUserProvider } from 'features/user';

if (process.browser) {
  smoothscroll.polyfill();
}

export const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <ReactQueryProvider dehydratedState={pageProps.dehydratedState}>
        <GlobalStyles />
        <CurrentUserProvider>
          <ConfirmModalProvider>
            <Component {...pageProps} />
            <ConfirmModal />
          </ConfirmModalProvider>
        </CurrentUserProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
};
