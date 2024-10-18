import { FC, ReactNode } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { ConfirmModal, ConfirmModalProvider, theme } from 'ui-legacy';

export const MaterialLayout: FC<{ children: ReactNode }> = ({ children }) => {
  if (process.browser)
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConfirmModalProvider>
          <ConfirmModal />
          {children}
        </ConfirmModalProvider>
      </ThemeProvider>
    );
  return null;
};
