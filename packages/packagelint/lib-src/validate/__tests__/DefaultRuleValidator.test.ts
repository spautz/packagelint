import {
  alwaysFailRuleValidationFn,
  PackagelintPreparedConfig,
  PackagelintPreparedRule,
  PackagelintRuleValidatorInstance,
  PackagelintValidationFn,
} from '@packagelint/core';

import {
  DefaultRuleValidator,
  PackageLintRuleValidator_MissingPreparedConfigError,
} from '../DefaultRuleValidator';
import { FAILURE__VALIDATION } from '../../util';

describe('DefaultRuleValidator', () => {
  let ruleValidator: PackagelintRuleValidatorInstance;
  let samplePreparedConfig: PackagelintPreparedConfig;
  let samplePassingRuleValidationFn: PackagelintValidationFn;
  let sampleFailingRuleValidationFn: PackagelintValidationFn;
  let sampleThrowingRuleValidationFn: PackagelintValidationFn;
  let samplePassingRule: PackagelintPreparedRule;
  let sampleFailingRule: PackagelintPreparedRule;
  let sampleThrowingRule: PackagelintPreparedRule;

  beforeEach(() => {
    ruleValidator = new DefaultRuleValidator();
    samplePreparedConfig = {
      failOnErrorLevel: 'error',
      rules: [],
      reporters: [],
      ruleValidatorInstance: ruleValidator,
    };

    samplePassingRuleValidationFn = jest.fn();
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

    sampleFailingRuleValidationFn = jest.fn().mockImplementation(alwaysFailRuleValidationFn);
    sampleFailingRule = {
      ...samplePassingRule,
      preparedRuleName: '@packageconfig/unit-tests:sample-fail',
      docs: { description: 'Sample failing rule' },
      doValidation: sampleFailingRuleValidationFn,
    };

    sampleThrowingRuleValidationFn = jest.fn().mockImplementation(() => {
      throw new Error('Oh no!');
    });
    sampleThrowingRule = {
      ...samplePassingRule,
      preparedRuleName: '@packageconfig/unit-tests:sample-throw',
      docs: { description: 'Sample throwing rule' },
      doValidation: sampleThrowingRuleValidationFn,
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
      numRules: 0,
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
      numRules: 1,
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
      numRules: 1,
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
      message: 'Oh no!',
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
      numRules: 1,
      numRulesFailed: 1,
      numRulesPassed: 0,
      rules: [sampleThrowingRule],
    });
  });
});
