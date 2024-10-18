/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
    '../ui/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      const themeColors = theme('colors');
      const font = theme('fontFamily');
      const hBase = {
        color: themeColors.secondaryDarkBlue900,
        fontFamily: font.primary,
        margin: 0,
        padding: 0,
        fontWeight: 'bold',
      };
      const subBase = {
        color: themeColors.secondaryDarkBlue910,
        fontFamily: font.secondary,
        fontWeight: 300,
        margin: 0,
        padding: 0,
      };

      const buttonBase = {
        fontFamily: font.primary,
        fontWeight: 500,
        letterSpacing: '0.1em',
        letterSpacing: '0.1em',
        margin: 0,
        padding: 0,
      };

      const newUtilities = {
        '.v-h800': {
          ...hBase,
          fontSize: 'clamp(48px, 4.2vw, 80px)',
          lineHeight: 1.1,
        },
        '.v-h600': {
          ...hBase,
          fontSize: 'clamp(32px, 3.75vw, 64px)',
          lineHeight: 1.125,
        },
        '.v-h400': {
          ...hBase,
          fontSize: 'clamp(28px, 2.5vw, 48px)',
          lineHeight: 1.3333,
        },
        '.v-h300': {
          ...hBase,
          fontWeight: 500,
          fontSize: 'clamp(24px, 1.6667vw, 32px)',
          lineHeight: 1.5,
        },
        '.v-h200': {
          ...hBase,
          fontWeight: 500,
          fontSize: 'clamp(20px, 1.25vw, 24px)',
          lineHeight: 1.3333,
        },
        '.v-h170': {
          ...hBase,
          fontWeight: 500,
          fontSize: '20px',
          lineHeight: 1.6,
        },
        '.v-h160': {
          ...hBase,
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: 1.5,
          textTransform: 'uppercase',
        },
        '.v-h150': {
          ...hBase,
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: 1.5,
        },
        '.v-text150': {
          fontFamily: font.secondary,
          fontWeight: 400,
          fontSize: 16,
          lineHeight: 1.5,
          letterSpacing: '0.05em',
        },
        '.v-label150': {
          fontFamily: font.secondary,
          fontWeight: 400,
          fontSize: 16,
          lineHeight: 1.5,
          letterSpacing: '0.05em',
        },
        '.v-text110': {
          fontFamily: font.primary,
          fontWeight: 500,
          fontSize: 12,
          lineHeight: 2,
          textTransform: 'uppercase',
        },
        '.v-label110': {
          fontFamily: font.primary,
          fontWeight: 500,
          fontSize: 12,
          lineHeight: 2,
          textTransform: 'uppercase',
        },

        '.v-text130': {
          ...subBase,
          fontSize: 14,
          fontWeight: 'normal',
          lineHeight: 1.7143,
          letterSpacing: '0.05em',
        },

        '.v-p130': {
          ...subBase,
          fontSize: 14,
          fontWeight: 'normal',
          lineHeight: 1.7143,
          letterSpacing: '0.05em',
        },

        '.v-sub170': {
          ...subBase,
          fontSize: 20,
          lineHeight: 1.5,
        },

        '.v-label120': {
          ...hBase,
          fontSize: 12,
          lineHeight: 1.71,
          textTransform: 'uppercase',
        },

        '.v-label140': {
          ...subBase,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.05em',
          lineHeight: 1.7143,
        },
        '.v-label141': {
          ...hBase,
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.7143,
          textTransform: 'uppercase',
        },

        '.v-button120': {
          ...buttonBase,
          fontSize: 12,
          lineHeight: 2,
        },
        '.v-button160': {
          ...buttonBase,
          fontSize: 16,
          lineHeight: 1.5,
        },
      };

      addUtilities(newUtilities, { respectImportant: false });
    }),
  ],
  important: true,
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  theme: {
    colors: {
      primaryBlue900: '#4781e8',
      primaryBlue910: '#a3c0f4',
      primaryBlue920: '#d1e0fa',
      primaryBlue930: '#e8f0fd',
      primaryBlue940: '#f4f8fe',
      secondaryDarkBlue900: '#323f5a',
      secondaryDarkBlue910: '#7b859f',
      secondaryDarkBlue920: '#9ba4b7',
      secondaryDarkBlue930: '#e2e6f0',
      secondaryDarkBlue921: '#cdd2db',
      secondaryDarkBlue940: '#eff2f9',
      secondaryDarkBlue950: '#f7f8fa',
      white: '#ffffff',
      auxiliaryRed900: '#FF6363',
      auxiliaryRed940: '#F9EFEF',
      auxiliaryGreen900: '#6FBE0B',
      auxiliaryGreen940: '#F0F9E5',
      auxiliaryCyan900: '#00C3DE',
      auxiliaryCyan940: '#E3FAFD',
      auxiliaryYellow900: '#FFC907',
    },
    spacing: {
      0: '0px',
      '1px': '1px',
      '4px': '4px',
      1: '8px',
      '12px': '12px',
      2: '16px',
      3: '24px',
      4: '32px',
      5: '40px',
      6: '48px',
      7: '56px',
      8: '64px',
      9: '72px',
      10: '80px',
      11: '88px',
      12: '96px',
      13: '104px',
      14: '112px',
      15: '120px',
      16: '128px',
      17: '136px',
      18: '144px',
      19: '152px',
      20: '160px',
      21: '168px',
      22: '176px',
      23: '184px',
      24: '192px',
      25: '200px',
      26: '208px',
      27: '216px',
      28: '224px',
      29: '232px',
      30: '240px',
      31: '248px',
      32: '256px',
      33: '264px',
      34: '272px',
    },
    borderRadius: {
      sm: '2px',
      DEFAULT: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      '2xl': '16px',
      large: '24px',
      '2x-large': '48px',
      full: '9999px',
    },
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '40px',
      '5xl': '48px',
      '8xl': '64px',
    },
    boxShadow: {
      shadow1: '0px 8px 16px rgba(71, 128, 232, 0.3)',
      shadow2: '0px 4px 16px rgba(195, 207, 230, 0.4)',
      shadow3: '0px 4px 16px rgba(20, 38, 70, 0.12)',
      shadow4: '0px 16px 40px rgba(20, 38, 70, 0.08)',
      btnShadow: '0px 8px 40px rgba(71, 128, 232, 0.4)',
      none: 'none',
    },
    fontFamily: {
      primary: "'TT Norms Pro', Arial, sans-serif",
      secondary: "'Encode Sans', Arial, sans-serif",
    },
  },
};
