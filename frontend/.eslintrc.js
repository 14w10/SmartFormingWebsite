// module.exports = {
//   parser: '@typescript-eslint/parser',

//   plugins: ['@typescript-eslint', 'react', 'react-hooks', 'simple-import-sort'],

//   extends: [
//     'plugin:@typescript-eslint/recommended',
//     'plugin:react/recommended',
//     'plugin:prettier/recommended',
//     'prettier/@typescript-eslint',
//     'prettier/react',
//   ],

//   parserOptions: {
//     ecmaVersion: 2018,
//     sourceType: 'module',
//     ecmaFeatures: {
//       jsx: true,
//     },
//   },

//   settings: {
//     react: {
//       version: 'detect',
//     },
//   },

//   rules: {
//     '@typescript-eslint/ban-types': 0,
//     '@typescript-eslint/camelcase': 0,
//     '@typescript-eslint/explicit-function-return-type': 0,
//     '@typescript-eslint/explicit-member-accessibility': 0,
//     '@typescript-eslint/explicit-module-boundary-types': 0,
//     '@typescript-eslint/interface-name-prefix': 0,
//     '@typescript-eslint/no-explicit-any': 0,
//     '@typescript-eslint/no-object-literal-type-assertion': 0,
//     'arrow-parens': [1, 'as-needed'],
//     'import/order': 0,
//     'no-duplicate-imports': 2,
//     'react-hooks/exhaustive-deps': 2,
//     'react-hooks/rules-of-hooks': 2,
//     'react/display-name': 0,
//     'react/no-unescaped-entities': 0,
//     'react/prop-types': 0,
//     'react/react-in-jsx-scope': 0,
//     'react/self-closing-comp': 1,
//     'sort-imports': 0,
//     'react/jsx-curly-brace-presence': [
//       2,
//       {
//         props: 'never',
//         children: 'never',
//       },
//     ],
//     'simple-import-sort/imports': [
//       1,
//       {
//         groups: [
//           ['^\\u0000'],
//           ['^react', '^next', '^[^.]'],
//           ['@smar'],
//           [
//             '^libs$',
//             '^libs/',
//             '^config$',
//             '^config/',
//             '^app/',
//             '^features/',
//             '^app-constants',
//             '^ui$',
//             '^ui/',
//           ],
//           ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
//           ['^.+\\.s?css$'],
//         ],
//       },
//     ],
//   },
// };
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'simple-import-sort'],
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020, // Updated to latest ECMAScript version
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // TypeScript ESLint Rules
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',

    // React Rules
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js 10+

    // React Hooks Rules
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',

    // Import Sort Rules
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // Update your import groups as needed
          ['^\\u0000'],
          ['^react', '^next', '^[^.]'],
          ['^@smar'],
          ['^libs', '^config', '^app', '^features', '^app-constants', '^ui'],
          ['^\\.'],
          ['^.+\\.s?css$'],
        ],
      },
    ],

    // Other ESLint Rules
    'arrow-parens': ['warn', 'as-needed'],
    'no-duplicate-imports': 'error',
    'react/self-closing-comp': 'warn',
    'react/jsx-curly-brace-presence': [
      'error',
      {
        props: 'never',
        children: 'never',
      },
    ],
    // Disable conflicting rules
    'import/order': 'off',
    'sort-imports': 'off',
  },
};
