module.exports = {
  root: true,
  extends: ['prettier/@typescript-eslint', 'plugin:prettier/recommended'],

  settings: {
    react: {
      version: 'detect',
    },
  },

  ignorePatterns: ['build/', 'dist/', 'coverage/', 'coverage-local/', 'node_modules/'],
};
