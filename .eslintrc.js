// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    'react/jsx-curly-brace-presence': 'off',
    'react/react-in-jsx-scope': 'off',
    'spaced-comment': 'error',
    'no-duplicate-imports': 'error',
    camelcase: 'error',
    quotes: ['error', 'single'],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
}
