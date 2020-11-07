module.exports = {
  root: true,
  extends: ['prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 6,
  },

  ignorePatterns: [
    'build/',
    'dist/',
    'coverage/',
    'coverage-local/',
    'node_modules/',
    'storybook-static/',
  ],
};
