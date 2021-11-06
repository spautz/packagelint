/* eslint-env node */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'prettier'],

  overrides: [
    {
      files: ['**/*.test.*', '**/tests/*.*'],
      env: {
        jest: true,
      },
    },
    {
      // Only add typescript rules for typescript files
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    },
  ],

  ignorePatterns: [
    'build/',
    'dist/',
    'coverage/',
    'coverage-local/',
    'dist/',
    'legacy-types/',
    'lib-dist/',
    'node_modules/',
  ],
};
