import {
  PackagelintRuleName,
  PackagelintRuleDefinition,
  PackagelintRulesetDefinition,
} from '@packagelint/core';

const { hasOwnProperty } = Object.prototype;

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
  > = Object.create(null);

  // Merge rules and rulesets, no matter what keys they were found under
  [packageExports.packagelintRules, packageExports.packagelintRulesets].forEach((ruleSource) => {
    if (ruleSource) {
      Object.keys(ruleSource).forEach((ruleName) => {
        const ruleInfo = ruleSource[ruleName];
        if (
          hasOwnProperty.call(packageRulesAndRulesets, ruleName) &&
          packageRulesAndRulesets[ruleName] !== ruleInfo
        ) {
          throw new Error(`Package "${packageName}" defines rule "${ruleName}" more than once`);
        }
      });
    }
  });

  return packageRulesAndRulesets[ruleOrRulesetName];
}

export { resolveRule };
