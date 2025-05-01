module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parser: '@babel/eslint-parser',
  env: {
    'react-native/react-native': true,
    jest: true,
  },
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': 'warn',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
