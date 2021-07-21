module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier/@typescript-eslint', 'prettier'],

  parserOptions: {
    ecmaVersion: 2020,
  },

  ignorePatterns: [
    'build/',
    'dist/',
    'coverage/',
    'coverage-local/',
    'dist/',
    'lib-dist/',
    'node_modules/',
  ],
};
