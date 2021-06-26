/* eslint-env node */

module.exports = {
  testPathIgnorePatterns: ['/build/', '/dist/', '/lib-dist/', '/node_modules/'],
  coveragePathIgnorePatterns: ['.*\\.(ignored|stories|test)\\.*'],
  // coverageDirectory should be set by consumer
  // collectCoverageFrom should be set by consumer
};
