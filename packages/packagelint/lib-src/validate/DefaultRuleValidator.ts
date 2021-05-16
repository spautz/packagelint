import {
  PackagelintPreparedRule,
  PackagelintOutput,
  PackagelintPreparedConfig,
  PackagelintValidationResult,
  PackagelintValidationError,
  PackagelintReporterInstance,
  PackagelintRuleValidatorInstance,
  PackagelintValidationContext,
  PackagelintValidationFnReturn,
} from '@packagelint/core';

import {
  ERROR_LEVEL__EXCEPTION,
  FAILURE__VALIDATION,
  SUCCESS,
  countErrorTypes,
  getHighestErrorLevel,
  isErrorLessSevereThan,
} from '../util';
import { broadcastEvent, broadcastEventUsingReporters } from '../report';

import { makeValidationContext } from './defaultRuleValidatorHelpers';

class DefaultRuleValidator implements Required<PackagelintRuleValidatorInstance> {
  async validatePreparedConfig(
    _preparedConfig: PackagelintPreparedConfig,
  ): Promise<PackagelintOutput> {
    return '@TODO' as any;
  }

  _makeValidationContext(_preparedRule: PackagelintPreparedRule): PackagelintValidationContext {
    return '@TODO' as any;
  }

  async _validateAllRules(): Promise<Array<PackagelintValidationResult>> {
    return Promise.resolve('@TODO' as any);
  }

  async _validateOneRule(
    _preparedRule: PackagelintPreparedRule,
  ): Promise<PackagelintValidationResult> {
    return Promise.resolve('@TODO' as any);
  }

  async _beforeRule(_ruleInfo: PackagelintPreparedRule): Promise<Array<void | unknown>> {
    return Promise.resolve('@TODO' as any);
  }

  _processRuleResult(
    _preparedRule: PackagelintPreparedRule,
    _rawResult: PackagelintValidationFnReturn,
  ): PackagelintValidationResult {
    return '@TODO' as any;
  }

  async _afterRule(_ruleInfo: PackagelintPreparedRule): Promise<Array<void | unknown>> {
    return Promise.resolve('@TODO' as any);
  }

  _getRawResults(): Array<PackagelintValidationResult> {
    return '@TODO' as any;
  }

  _getValidationOutput(): PackagelintOutput {
    return '@TODO' as any;
  }
}

async function doValidation(preparedConfig: PackagelintPreparedConfig): Promise<PackagelintOutput> {
  const { failOnErrorLevel, rules, reporters } = preparedConfig;

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

async function validateRuleList(
  ruleList: Array<PackagelintPreparedRule>,
  reporterList: Array<PackagelintReporterInstance>,
): Promise<Array<PackagelintValidationResult>> {
  return await Promise.all(
    ruleList.map((preparedRule) => {
      return validateOneRule(preparedRule, reporterList);
    }),
  );
}

async function validateOneRule(
  preparedRule: PackagelintPreparedRule,
  reporterList: Array<PackagelintReporterInstance>,
): Promise<PackagelintValidationResult> {
  const { preparedRuleName, enabled, errorLevel, options, messages } = preparedRule;
  let result = null;

  if (enabled) {
    await broadcastEventUsingReporters(reporterList, 'onRuleStart', preparedRule);

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
    await broadcastEventUsingReporters(reporterList, 'onRuleResult', preparedRule, result);
  }
  return result;
}

export { DefaultRuleValidator, doValidation, validateRuleList, validateOneRule };
