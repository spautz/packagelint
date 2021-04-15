module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],

  parserOptions: {
    ecmaVersion: 2020,
  },

  ignorePatterns: ['build/', 'dist/', 'coverage/', 'coverage-local/', 'lib-dist/', 'node_modules/'],
};
