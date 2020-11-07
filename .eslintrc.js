module.exports = {
  root: true,
  extends: ['prettier/@typescript-eslint', 'plugin:prettier/recommended'],

  ignorePatterns: [
    'build/',
    'dist/',
    'coverage/',
    'coverage-local/',
    'node_modules/',
    'storybook-static/',
  ],
};
