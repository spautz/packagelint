import {
  PackagelintProcessedRule,
  PackagelintOutput,
  PackagelintProcessedConfig,
  PackagelintValidationResult,
  PackagelintUnknownOptions,
  PackagelintValidationContext,
} from '@packagelint/core';

function doValidation(processedConfig: PackagelintProcessedConfig): PackagelintOutput {
  // const { failOnErrorLevel, rules } = processedConfig;
  console.log('doValidation()', processedConfig);
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
  ruleList: Array<PackagelintProcessedRule>,
  options: PackagelintUnknownOptions,
): Array<PackagelintValidationResult> {
  return ruleList.map((processedRule) => {
    const context = makeValidationContext();
    return processedRule.doValidation(options, context) as PackagelintValidationResult;
  });
}

function makeValidationContext(): PackagelintValidationContext {
  return {} as PackagelintValidationContext;
}

export { doValidation, validateRuleList };
