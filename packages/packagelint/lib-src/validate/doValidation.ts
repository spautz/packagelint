import {
  PackagelintPreparedRule,
  PackagelintOutput,
  PackagelintPreparedConfig,
  PackagelintValidationResult,
  PackagelintValidationError,
} from '@packagelint/core';

import {
  countErrorTypes,
  ERROR_LEVEL__EXCEPTION,
  getHighestErrorLevel,
  isErrorLessSevereThan,
} from './errorLevels';
import { SUCCESS, FAILURE__VALIDATION } from './exitCodes';
import { makeValidationContext } from './validationContext';

async function doValidation(preparedConfig: PackagelintPreparedConfig): Promise<PackagelintOutput> {
  const { failOnErrorLevel, rules } = preparedConfig;
  console.log('doValidation()', preparedConfig);

  const allResults = await validateRuleList(rules);

  const errorResults = allResults.filter(
    (validationResult) => !!validationResult,
  ) as Array<PackagelintValidationError>;

  const errorLevelCounts = countErrorTypes(errorResults);
  const highestErrorLevel = getHighestErrorLevel(errorLevelCounts);
  const exitCode = isErrorLessSevereThan(highestErrorLevel, failOnErrorLevel)
    ? SUCCESS
    : FAILURE__VALIDATION;

  return {
    numRules: rules.length,
    numRulesPassed: rules.length - errorResults.length,
    numRulesFailed: errorResults.length,
    exitCode,

    highestErrorLevel,
    errorLevelCounts,

    errorResults: errorResults,
  };
}

async function validateRuleList(
  ruleList: Array<PackagelintPreparedRule>,
): Promise<Array<PackagelintValidationResult>> {
  return await Promise.all(ruleList.map(validateOneRule));
}

async function validateOneRule(
  preparedRule: PackagelintPreparedRule,
): Promise<PackagelintValidationResult> {
  const { ruleName, enabled, errorLevel, options, messages } = preparedRule;
  let result = null;

  if (enabled) {
    const context = makeValidationContext(preparedRule);
    console.log('validating rule....', preparedRule);
    try {
      const validationErrorInfo = await preparedRule.doValidation(options, context);

      if (validationErrorInfo) {
        const [errorName, errorData] = validationErrorInfo;
        result = {
          ruleName: ruleName,
          errorLevel,
          errorName,
          errorData: errorData,
          // @TODO: Apply errorData to template
          message: messages[errorName] || errorName,
        };
      }
    } catch (e) {
      result = {
        ruleName: ruleName,
        errorLevel: ERROR_LEVEL__EXCEPTION,
        errorName: null,
        errorData: null,
        message: e.message,
      };
    }
    console.log('validating rule => ', result);
  }
  return result;
}

export { doValidation, validateRuleList, validateOneRule };
