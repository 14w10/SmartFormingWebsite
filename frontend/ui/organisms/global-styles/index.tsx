import { createGlobalStyle } from 'styled-components';

import { cssCustomProps } from '../../theme';

export const GlobalStyles = createGlobalStyle`
  :root {
    ${cssCustomProps}
  }
`;
