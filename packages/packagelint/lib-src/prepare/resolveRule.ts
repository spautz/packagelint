import {
  PackagelintRuleName,
  PackagelintRuleDefinition,
  PackagelintRulesetDefinition,
} from '@packagelint/core';

function resolveRule(
  name: PackagelintRuleName,
): PackagelintRuleDefinition | PackagelintRulesetDefinition {
  // @TODO: Implement this properly
  // @TODO: Validation

  const [packageName, ruleOrRulesetName] = name.split(':');

  if (!packageName || !ruleOrRulesetName) {
    throw new Error(`Rule "${name}" is not a valid rule name`);
  }

  const { packagelintExports } = require(packageName);

  if (!packagelintExports) {
    throw new Error(`Package "${packageName}" does not provide any packagelint exports`);
  }
  if (typeof packagelintExports !== 'object') {
    throw new Error(`Package "${packageName}" does not provide any valid packagelint exports`);
  }
  if (!Object.prototype.hasOwnProperty.call(packagelintExports, ruleOrRulesetName)) {
    throw new Error(`Package "${packageName}" does not provide rule "${ruleOrRulesetName}"`);
  }

  return packagelintExports[ruleOrRulesetName];
}

export { resolveRule };
