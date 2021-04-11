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

  return require('@packagelint/core').packagelintRules['nvmrc'];
}

export { resolveRule };
