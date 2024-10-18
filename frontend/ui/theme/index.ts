import { objectToCssCustomProps } from '../util';
import { colors } from './theme-colors';

export const breakpoints = ['768px', '1024px', '1440px', '1920px'];

const fonts = {
  primary: "'TT Norms Pro', Arial, sans-serif",
  secondary: "'Encode Sans', Arial, sans-serif",
};

const fontSizes = {
  subheadline: '24px',
  body: '20px',
  small: '12px',
};

const lineHeights = { default: 1.5 };

const fontWeights = {
  b: 700,
  sb: 600,
  m: 500,
  r: 400,
};

export const theme = {
  breakpoints,
  colors,
  fonts,
  fontSizes,
  lineHeights,
  fontWeights,
  space: [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96],
};

const boxShadows = {
  shadow1: '0px 8px 16px rgba(71, 128, 232, 0.3)',
  shadow2: '0px 4px 16px rgba(195, 207, 230, 0.4)',
  shadow3: '0px 4px 16px rgba(20, 38, 70, 0.12)',
  shadow4: '0px 16px 40px rgba(20, 38, 70, 0.08)',
  btnShadow: '0px 8px 40px rgba(71, 128, 232, 0.4)',
};

export const cssCustomProps = objectToCssCustomProps({
  ...theme.colors,
  ...boxShadows,
  fonts,
});
