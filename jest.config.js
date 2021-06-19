/* eslint-env node */

module.exports = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['packages/*/{src,lib,lib-src}/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: [
    '.*\\.(ignored|stories|test)\\.*',
    'build/',
    'dist/',
    'lib-dist/',
    'node_modules/',
  ],
};
