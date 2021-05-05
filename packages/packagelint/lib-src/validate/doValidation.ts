import {
  PackagelintPreparedRule,
  PackagelintOutput,
  PackagelintPreparedConfig,
  PackagelintValidationResult,
  PackagelintValidationError,
  PackagelintReporter,
} from '@packagelint/types';

import {
  countErrorTypes,
  ERROR_LEVEL__EXCEPTION,
  getHighestErrorLevel,
  isErrorLessSevereThan,
} from './errorLevels';
import { SUCCESS, FAILURE__VALIDATION } from './exitCodes';
import { makeValidationContext } from './validationContext';
import { broadcastEvent, broadcastEventUsingReporters } from '../report';

async function doValidation(preparedConfig: PackagelintPreparedConfig): Promise<PackagelintOutput> {
  const { failOnErrorLevel, rules, reporters } = preparedConfig;

  broadcastEvent(preparedConfig, 'onValidationStart', preparedConfig);

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

  broadcastEvent(preparedConfig, 'onValidationComplete', output);

  return output;
}

async function validateRuleList(
  ruleList: Array<PackagelintPreparedRule>,
  reporterList: Array<PackagelintReporter>,
): Promise<Array<PackagelintValidationResult>> {
  return await Promise.all(
    ruleList.map((preparedRule) => {
      return validateOneRule(preparedRule, reporterList);
    }),
  );
}

async function validateOneRule(
  preparedRule: PackagelintPreparedRule,
  reporterList: Array<PackagelintReporter>,
): Promise<PackagelintValidationResult> {
  const { preparedRuleName, enabled, errorLevel, options, messages } = preparedRule;
  let result = null;

  if (enabled) {
    broadcastEventUsingReporters(reporterList, 'onRuleStart', preparedRule);

    const context = makeValidationContext(preparedRule);

    try {
      const validationErrorInfo = await preparedRule.doValidation(options, context);

      if (validationErrorInfo) {
        const [errorName, errorData] = validationErrorInfo;
        result = {
          preparedRuleName: preparedRuleName,
          errorLevel,
          errorName,
          errorData: errorData,
          // @TODO: Apply errorData to template
          message: messages[errorName] || errorName,
        };
      }
    } catch (e) {
      result = {
        preparedRuleName: preparedRuleName,
        errorLevel: ERROR_LEVEL__EXCEPTION,
        errorName: null,
        errorData: null,
        message: e.message,
      };
    }
    broadcastEventUsingReporters(reporterList, 'onRuleResult', preparedRule, result);
  }
  return result;
}

export { doValidation, validateRuleList, validateOneRule };
