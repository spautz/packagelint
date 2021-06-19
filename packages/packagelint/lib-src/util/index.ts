import { PackagelintRuleDefinition, PackagelintRulesetDefinition } from '@packagelint/core';

export * from './errorLevels';
export * from './resolvers';

export function isRuleDefinition(ruleInfo: unknown): ruleInfo is PackagelintRuleDefinition {
  // @TODO: Proper validation
  // @ts-ignore
  return !!ruleInfo?.doValidation;
}

export function isRulesetDefinition(ruleInfo: unknown): ruleInfo is PackagelintRulesetDefinition {
  // @TODO: Proper validation
  // @ts-ignore
  return !!ruleInfo?.rules;
}
