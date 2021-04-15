import {
  PackagelintPreparedRule,
  PackagelintOutput,
  PackagelintPreparedConfig,
  PackagelintValidationResult,
  PackagelintUnknownOptions,
  PackagelintValidationContext,
} from '@packagelint/core';

function doValidation(preparedConfig: PackagelintPreparedConfig): PackagelintOutput {
  // const { failOnErrorLevel, rules } = preparedConfig;
  console.log('doValidation()', preparedConfig);
  //
  // const errorResults = validateRuleList(rules);
  //
  // const errorLevelCounts = errorResults.reduce((counts, )=> {
  //   return counts
  // },{})

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

    errorResults: [],
  };
}

function validateRuleList(
  ruleList: Array<PackagelintPreparedRule>,
  options: PackagelintUnknownOptions,
): Array<PackagelintValidationResult> {
  return ruleList.map((preparedRule) => {
    const context = makeValidationContext();
    return preparedRule.doValidation(options, context) as PackagelintValidationResult;
  });
}

function makeValidationContext(): PackagelintValidationContext {
  return {} as PackagelintValidationContext;
}

export { doValidation, validateRuleList };
