import {
  PackagelintOutput,
  PackagelintPreparedConfig,
  PackagelintValidationError,
} from '@packagelint/core';

import {
  FAILURE__VALIDATION,
  SUCCESS,
  countErrorTypes,
  getHighestErrorLevel,
  isErrorLessSevereThan,
} from '../util';
import { broadcastEvent } from '../report';

import { validateRuleList } from './DefaultRuleValidator';

async function validatePreparedConfig(
  preparedConfig: PackagelintPreparedConfig,
): Promise<PackagelintOutput> {
  const { ruleValidatorInstance, failOnErrorLevel, rules, reporters } = preparedConfig;

  console.log('ruleValidator instance: ', ruleValidatorInstance);

  await broadcastEvent(preparedConfig, 'onValidationStart', preparedConfig);

  const allResults = await validateRuleList(rules, reporters);

  const errorResults = allResults.filter(
    (validationResult) => !!validationResult,
  ) as Array<PackagelintValidationError>;

  const errorLevelCounts = countErrorTypes(errorResults);
  const highestErrorLevel = getHighestErrorLevel(errorLevelCounts);
  const exitCode = isErrorLessSevereThan(highestErrorLevel, failOnErrorLevel)
    ? SUCCESS
    : FAILURE__VALIDATION;

  const output = {
    numRules: rules.length,
    numRulesPassed: rules.length - errorResults.length,
    numRulesFailed: errorResults.length,
    exitCode,

    highestErrorLevel,
    errorLevelCounts,
    rules,
    allResults,
    errorResults: errorResults,
  };

  await broadcastEvent(preparedConfig, 'onValidationComplete', output);

  return output;
}

export { validatePreparedConfig };
