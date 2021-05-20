import {
  alwaysFailRuleValidationFn,
  alwaysPassRuleValidationFn,
  alwaysThrowRuleValidationFn,
  PackagelintPreparedConfig,
  PackagelintPreparedRule,
  PackagelintRulePreparerInstance,
  PackagelintRuleValidatorInstance,
  PackagelintValidationFn,
} from '@packagelint/core';

import {
  DefaultRuleValidator,
  PackageLintRuleValidator_MissingPreparedConfigError,
} from '../DefaultRuleValidator';
import { FAILURE__VALIDATION } from '../../util';

describe('DefaultRuleValidator basics', () => {
  let ruleValidator: PackagelintRuleValidatorInstance;
  let samplePreparedConfig: PackagelintPreparedConfig;
  let samplePassingRuleValidationFn: PackagelintValidationFn;
  let sampleFailingRuleValidationFn: PackagelintValidationFn;
  let sampleThrowingRuleValidationFn: PackagelintValidationFn;
  let sampleDisabledRuleValidationFn: PackagelintValidationFn;
  let samplePassingRule: PackagelintPreparedRule;
  let sampleFailingRule: PackagelintPreparedRule;
  let sampleThrowingRule: PackagelintPreparedRule;
  let sampleDisabledRule: PackagelintPreparedRule;

  beforeEach(() => {
    ruleValidator = new DefaultRuleValidator();
    samplePreparedConfig = {
      failOnErrorLevel: 'error',
      rules: [],
      reporters: [],
      rulePreparerInstance: {} as PackagelintRulePreparerInstance,
      ruleValidatorInstance: ruleValidator,
    };

    samplePassingRuleValidationFn = jest.fn(alwaysPassRuleValidationFn);
    samplePassingRule = {
      preparedRuleName: '@packageconfig/unit-tests:sample-pass',
      docs: { description: 'Sample passing rule' },
      enabled: true,
      extendedFrom: null,
      defaultErrorLevel: 'error',
      errorLevel: 'error',
      defaultOptions: {},
      options: {},
      messages: {},
      doValidation: samplePassingRuleValidationFn,
    };

    sampleFailingRuleValidationFn = jest.fn(alwaysFailRuleValidationFn);
    sampleFailingRule = {
      ...samplePassingRule,
      preparedRuleName: '@packageconfig/unit-tests:sample-fail',
      docs: { description: 'Sample failing rule' },
      doValidation: sampleFailingRuleValidationFn,
    };

    sampleThrowingRuleValidationFn = jest.fn(alwaysThrowRuleValidationFn);
    sampleThrowingRule = {
      ...sampleFailingRule,
      preparedRuleName: '@packageconfig/unit-tests:sample-throw',
      docs: { description: 'Sample throwing rule' },
      doValidation: sampleThrowingRuleValidationFn,
    };

    sampleDisabledRuleValidationFn = jest.fn(alwaysThrowRuleValidationFn);
    sampleDisabledRule = {
      ...sampleThrowingRule,
      preparedRuleName: '@packageconfig/unit-tests:sample-disabled',
      docs: { description: 'Sample disabled rule' },
      doValidation: sampleDisabledRuleValidationFn,
      enabled: false,
    };
  });

  it('is a well-formed class', () => {
    expect(ruleValidator).toBeInstanceOf(DefaultRuleValidator);
  });

  it('requires a preparedConfig', () => {
    // @ts-expect-error
    const result = ruleValidator.validatePreparedConfig();

    expect(result).toBeInstanceOf(Promise);
    return expect(result).rejects.toThrowError(
      'RuleValidator.validatePreparedConfig() must be given a preparedConfig',
    );
  });

  const fnsToSkip = ['constructor', 'validatePreparedConfig'];
  const fnsThatThrow = [
    '_makeValidationContext',
    '_processRuleResult',
    '_getRawResults',
    '_getValidationOutput',
  ];
  const fnsThatRejectPromise = [
    '_validateAllRules',
    '_validateOneRule',
    '_beforeRule',
    '_afterRule',
  ];
  const allRecognizedFns = [...fnsToSkip, ...fnsThatThrow, ...fnsThatRejectPromise];

  it('checks all prototype functions', () => {
    const allFns = Object.getOwnPropertyNames(DefaultRuleValidator.prototype);
    expect(allFns.sort()).toEqual(allRecognizedFns.sort());
  });

  fnsThatThrow.forEach((fnName) => {
    it(`${fnName} throws without a preparedConfig`, () => {
      const fnNameWithoutUnderscore = fnName.replace('_', '');
      expect(() => {
        // @ts-expect-error
        ruleValidator[fnName]();
      }).toThrowError(
        `Packagelint internal error: Cannot ${fnNameWithoutUnderscore} when no preparedConfig is set`,
      );
    });
  });

  fnsThatRejectPromise.forEach((fnName) => {
    it(`${fnName} rejects without a preparedConfig`, () => {
      // @ts-expect-error
      const result = ruleValidator[fnName]();

      expect(result).toBeInstanceOf(Promise);
      return expect(result).rejects.toBeInstanceOf(
        PackageLintRuleValidator_MissingPreparedConfigError,
      );
    });
  });

  it('accepts a valid preparedConfig', () => {
    const result = ruleValidator.validatePreparedConfig(samplePreparedConfig);

    expect(result).toBeInstanceOf(Promise);
    return expect(result).resolves.toEqual({
      allResults: [],
      errorLevelCounts: {
        exception: 0,
        error: 0,
        warning: 0,
        suggestion: 0,
        ignore: 0,
      },
      errorResults: [],
      exitCode: 0,
      highestErrorLevel: 'ignore',
      numRulesEnabled: 0,
      numRulesDisabled: 0,
      numRulesFailed: 0,
      numRulesPassed: 0,
      rules: [],
    });
  });

  it('runs a passing rule', async () => {
    const result = await ruleValidator.validatePreparedConfig({
      ...samplePreparedConfig,
      rules: [samplePassingRule],
    });

    expect(samplePassingRuleValidationFn).toBeCalled();
    expect(samplePassingRuleValidationFn).toBeCalledTimes(1);

    expect(result).toEqual({
      allResults: [null],
      errorLevelCounts: {
        exception: 0,
        error: 0,
        warning: 0,
        suggestion: 0,
        ignore: 0,
      },
      errorResults: [],
      exitCode: 0,
      highestErrorLevel: 'ignore',
      numRulesEnabled: 1,
      numRulesDisabled: 0,
      numRulesFailed: 0,
      numRulesPassed: 1,
      rules: [samplePassingRule],
    });
  });

  it('runs a failing rule', async () => {
    const result = await ruleValidator.validatePreparedConfig({
      ...samplePreparedConfig,
      rules: [sampleFailingRule],
    });
    const expectedFailureResult = {
      errorData: {},
      errorLevel: 'error',
      errorName: 'alwaysFail',
      message: 'alwaysFail',
      preparedRuleName: '@packageconfig/unit-tests:sample-fail',
    };

    expect(sampleFailingRuleValidationFn).toBeCalled();
    expect(sampleFailingRuleValidationFn).toBeCalledTimes(1);
    expect(result).toEqual({
      allResults: [expectedFailureResult],
      errorLevelCounts: {
        exception: 0,
        error: 1,
        warning: 0,
        suggestion: 0,
        ignore: 0,
      },
      errorResults: [expectedFailureResult],
      exitCode: FAILURE__VALIDATION,
      highestErrorLevel: 'error',
      numRulesEnabled: 1,
      numRulesDisabled: 0,
      numRulesFailed: 1,
      numRulesPassed: 0,
      rules: [sampleFailingRule],
    });
  });

  it('runs a rule that throws', async () => {
    const result = await ruleValidator.validatePreparedConfig({
      ...samplePreparedConfig,
      rules: [sampleThrowingRule],
    });
    const expectedThrownResult = {
      errorData: null,
      errorLevel: 'exception',
      errorName: null,
      message: 'This rule will always throw an error',
      preparedRuleName: '@packageconfig/unit-tests:sample-throw',
    };

    expect(sampleThrowingRuleValidationFn).toBeCalled();
    expect(sampleThrowingRuleValidationFn).toBeCalledTimes(1);
    return expect(result).toEqual({
      allResults: [expectedThrownResult],
      errorLevelCounts: {
        exception: 1,
        error: 0,
        warning: 0,
        suggestion: 0,
        ignore: 0,
      },
      errorResults: [expectedThrownResult],
      exitCode: FAILURE__VALIDATION,
      highestErrorLevel: 'exception',
      numRulesEnabled: 1,
      numRulesDisabled: 0,
      numRulesFailed: 1,
      numRulesPassed: 0,
      rules: [sampleThrowingRule],
    });
  });

  it('does not run disabled rules', async () => {
    const result = await ruleValidator.validatePreparedConfig({
      ...samplePreparedConfig,
      rules: [sampleDisabledRule],
    });

    expect(sampleDisabledRuleValidationFn).not.toBeCalled();
    expect(result).toEqual({
      allResults: [undefined],
      errorLevelCounts: {
        exception: 0,
        error: 0,
        warning: 0,
        suggestion: 0,
        ignore: 0,
      },
      errorResults: [],
      exitCode: 0,
      highestErrorLevel: 'ignore',
      numRulesEnabled: 0,
      numRulesDisabled: 1,
      numRulesFailed: 0,
      numRulesPassed: 0,
      rules: [sampleDisabledRule],
    });
  });

  // Tests above this point cover basic functionality.
  // Tests below this point cover full scenarios.

  it('runs multiple rules', async () => {
    const result = await ruleValidator.validatePreparedConfig({
      ...samplePreparedConfig,
      rules: [sampleDisabledRule, sampleFailingRule, samplePassingRule, sampleThrowingRule],
    });
    const expectedFailureResult = {
      errorData: {},
      errorLevel: 'error',
      errorName: 'alwaysFail',
      message: 'alwaysFail',
      preparedRuleName: '@packageconfig/unit-tests:sample-fail',
    };
    const expectedThrownResult = {
      errorData: null,
      errorLevel: 'exception',
      errorName: null,
      message: 'This rule will always throw an error',
      preparedRuleName: '@packageconfig/unit-tests:sample-throw',
    };

    expect(sampleDisabledRuleValidationFn).not.toBeCalled();
    expect(sampleFailingRuleValidationFn).toBeCalled();
    expect(samplePassingRuleValidationFn).toBeCalled();
    expect(sampleThrowingRuleValidationFn).toBeCalled();

    expect(result).toEqual({
      allResults: [undefined, expectedFailureResult, null, expectedThrownResult],
      errorLevelCounts: {
        exception: 1,
        error: 1,
        warning: 0,
        suggestion: 0,
        ignore: 0,
      },
      errorResults: [expectedFailureResult, expectedThrownResult],
      exitCode: FAILURE__VALIDATION,
      highestErrorLevel: 'exception',
      numRulesEnabled: 3,
      numRulesDisabled: 1,
      numRulesFailed: 2,
      numRulesPassed: 1,
      rules: [sampleDisabledRule, sampleFailingRule, samplePassingRule, sampleThrowingRule],
    });
  });
});
