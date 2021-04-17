import {
  PackagelintPreparedRule,
  PackagelintOutput,
  PackagelintPreparedConfig,
  PackagelintValidationResult,
  PackagelintValidationContext,
  PackagelintValidationError,
} from '@packagelint/core';

async function doValidation(preparedConfig: PackagelintPreparedConfig): Promise<PackagelintOutput> {
  const { rules } = preparedConfig;
  console.log('doValidation()', preparedConfig);

  const allResults = await validateRuleList(rules);

  const errorResults = allResults.filter(
    (validationResult) => !!validationResult,
  ) as Array<PackagelintValidationError>;

  // @TODO
  // const errorLevelCounts = errorResults.reduce((counts) => {
  //   return counts;
  // }, {});

  return {
    _inputUserConfig: undefined,
    _inputRules: [],

    highestErrorLevel: null,
    errorLevelCounts: {
      exception: 0,
      error: 0,
      warn: 0,
      suggestion: 0,
      ignore: 0,
    },
    exitCode: 0,

    errorResults: errorResults,
  };
}

/**
 * @TODO
 */
function makeValidationContext(): PackagelintValidationContext {
  return {} as PackagelintValidationContext;
}

async function validateRuleList(
  ruleList: Array<PackagelintPreparedRule>,
): Promise<Array<PackagelintValidationResult>> {
  return await Promise.all(ruleList.map(validateOneRule));
}

async function validateOneRule(
  preparedRule: PackagelintPreparedRule,
): Promise<PackagelintValidationResult> {
  const { ruleName, enabled, options } = preparedRule;
  let result = null;

  if (enabled) {
    const context = makeValidationContext();
    console.log('validating rule....', preparedRule);
    try {
      result = await preparedRule.doValidation(options, context);
    } catch (e) {
      result = {
        ruleName: ruleName,
        errorLevel: 'exception',
        errorData: {},
        message: e.message,
      } as const;
    }
    console.log('validating rule => ', result);
  }
  return result;
}

export { doValidation, validateRuleList, validateOneRule };
