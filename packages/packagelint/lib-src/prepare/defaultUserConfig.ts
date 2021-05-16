import { PackagelintUserConfig } from '@packagelint/core';

import { DefaultRuleValidator } from '../validate';

const defaultUserConfig: PackagelintUserConfig = {
  failOnErrorLevel: 'error',
  rules: ['@packagelint/core:always-fail'],
  reporters: {
    '@packagelint/core:internalDebugReporter': true,
  },
  RuleValidator: DefaultRuleValidator,
};

export { defaultUserConfig };
