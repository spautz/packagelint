import { PackagelintUserConfig } from '@packagelint/core';

import { DefaultRulePreparer } from './prepare/DefaultRulePreparer';
import { DefaultRuleValidator } from './validate';

const defaultUserConfig: PackagelintUserConfig = {
  failOnErrorLevel: 'error',
  rules: ['@packagelint/core:always-fail'],
  reporters: {
    '@packagelint/core:internalDebugReporter': true,
  },
  RulePreparer: DefaultRulePreparer,
  RuleValidator: DefaultRuleValidator,
};

export { defaultUserConfig };
