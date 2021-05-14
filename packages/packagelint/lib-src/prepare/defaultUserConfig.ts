import { PackagelintUserConfig } from '@packagelint/core';

const defaultUserConfig: PackagelintUserConfig = {
  failOnErrorLevel: 'error',
  rules: ['@packagelint/core:always-fail'],
  reporters: {
    '@packagelint/core:internalDebugReporter': true,
  },
};

export { defaultUserConfig };
