import { createTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4781E8',
      dark: '#3b4854',
    },
    secondary: {
      main: '#9BA4B7',
      light: '#DADADA',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#eff2f9',
    },
  },
  typography: {
    fontFamily: ['"TT Norms Pro"', '"Encode Sans"', 'Roboto'].join(','),
    body1: {
      fontSize: '14px',
      fontWeight: 500,
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
    },
    h3: {
      fontSize: 24,
      fontWeight: 500,
    },
    h4: {
      fontSize: 16,
      fontWeight: 500,
    },
    h5: {
      fontWeight: 700,
    },
  },
  overrides: {
    MuiPaper: {
      rounded: {
        borderRadius: '8px',
      },
    },
    MuiButton: {
      root: {
        borderRadius: '8px',
        fontSize: '14px',
      },
    },
  },
});
