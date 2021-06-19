import {
  PackagelintPreparedConfig,
  PackagelintRulePreparerInstance,
  PackagelintRuleValidatorInstance,
  ERROR_LEVEL__ERROR,
} from '@packagelint/types';

import { validatePreparedConfig } from '../validate';

describe('validate/validatePreparedConfig', () => {
  it('throws immediately if there is no ruleValidatorInstance', () => {
    expect(() => {
      return validatePreparedConfig({} as PackagelintPreparedConfig);
    }).toThrowError('Packagelint internal error: Missing ruleValidatorInstance in preparedConfig');
  });

  it('throws immediately if there is a invalid ruleValidatorInstance', () => {
    expect(() => {
      return validatePreparedConfig({
        failOnErrorLevel: 'error',
        rules: [],
        reporters: [],
        rulePreparerInstance: {} as PackagelintRulePreparerInstance,
        ruleValidatorInstance: {} as PackagelintRuleValidatorInstance,
      });
    }).toThrowError('Packagelint internal error: Invalid ruleValidatorInstance in preparedConfig');
  });

  it('throws immediately if there is an invalid ruleValidatorInstance.validatePreparedConfig', () => {
    expect(() => {
      return validatePreparedConfig({
        failOnErrorLevel: 'error',
        rules: [],
        reporters: [],
        rulePreparerInstance: {} as PackagelintRulePreparerInstance,
        ruleValidatorInstance: {
          validatePreparedConfig: 'absent',
        } as any,
      });
    }).toThrowError('Packagelint internal error: Invalid ruleValidatorInstance in preparedConfig');
  });

  it('uses ruleValidatorInstance', async () => {
    const myCompletelyNewImplementation = jest.fn();

    class MyCustomValidator {
      validatePreparedConfig(preparedConfig: PackagelintPreparedConfig) {
        return myCompletelyNewImplementation(preparedConfig);
      }
    }

    const myFakePreparedConfig = {
      failOnErrorLevel: ERROR_LEVEL__ERROR,
      rules: [],
      reporters: [],
      rulePreparerInstance: {} as PackagelintRulePreparerInstance,
      ruleValidatorInstance: new MyCustomValidator(),
    };

    await validatePreparedConfig(myFakePreparedConfig);

    expect(myCompletelyNewImplementation).toHaveBeenCalled();
    expect(myCompletelyNewImplementation).toHaveBeenCalledTimes(1);
    expect(myCompletelyNewImplementation).toHaveBeenCalledWith(myFakePreparedConfig);
  });
});
