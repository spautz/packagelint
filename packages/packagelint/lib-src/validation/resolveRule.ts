import { merge } from 'lodash-es';

import {
  PackagelintRuleName,
  PackagelintRuleDefinition,
  PackagelintRulesetDefinition,
} from '@packagelint/core';

function resolveRule(
  name: PackagelintRuleName,
): PackagelintRuleDefinition | PackagelintRulesetDefinition {
  console.log('resolveRule()', name);

  // @TODO: Implement this

  const packageName = '@packagelint/core';
  const ruleOrRulesetName = 'nvmrc';

  const packageExports = require(packageName);
  const packageRulesAndRulesets: Record<
    string,
    PackagelintRuleDefinition | PackagelintRulesetDefinition
  > = merge({}, packageExports.packagelintRules, packageExports.packagelintRulesets);

  return packageRulesAndRulesets[ruleOrRulesetName];
}

export { resolveRule };
