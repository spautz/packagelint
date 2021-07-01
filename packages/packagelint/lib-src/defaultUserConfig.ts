import { PackagelintUserConfig } from '@packagelint/types';

import { DefaultRulePreparer } from './prepare/DefaultRulePreparer';
import { DefaultRuleValidator } from './validate';

const defaultUserConfig: PackagelintUserConfig = {
  failOnErrorLevel: 'error',
  rules: ['@packagelint/core:always-fail'],
  reporters: {
    '@packagelint/core:internalDebugReporter': true,
  },
  _RulePreparer: DefaultRulePreparer,
  _RuleValidator: DefaultRuleValidator,
};

export { defaultUserConfig };
