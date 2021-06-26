import {
  PackagelintErrorLevelCounts,
  PackagelintRuleDefinition,
  PackagelintRulesetDefinition,
  PackagelintValidationResult,
} from '@packagelint/types';

export * from './resolveConstructor';

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

export function countErrorTypes(
  validationResults: Array<PackagelintValidationResult>,
): PackagelintErrorLevelCounts {
  const errorLevelCounts = validationResults.reduce(
    (counts, result) => {
      if (result) {
        counts[result.errorLevel] ||= 0;
        counts[result.errorLevel]++;
      }
      return counts;
    },
    {
      exception: 0,
      error: 0,
      warning: 0,
      suggestion: 0,
      ignore: 0,
    },
  );

  return errorLevelCounts;
}
