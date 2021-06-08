import { PackagelintOutput, PackagelintPreparedConfig } from '@packagelint/core';

import { PackageLintRuleValidator_InternalValidateError, isFunction } from '../util';

function validatePreparedConfig(
  preparedConfig: PackagelintPreparedConfig,
): Promise<PackagelintOutput> {
  const { ruleValidatorInstance } = preparedConfig;

  if (!ruleValidatorInstance) {
    throw new PackageLintRuleValidator_InternalValidateError(
      'Missing ruleValidatorInstance in preparedConfig',
    );
  }
  if (
    !ruleValidatorInstance.validatePreparedConfig ||
    !isFunction(ruleValidatorInstance.validatePreparedConfig)
  ) {
    throw new PackageLintRuleValidator_InternalValidateError(
      'Invalid ruleValidatorInstance in preparedConfig',
    );
  }

  const output = ruleValidatorInstance.validatePreparedConfig(preparedConfig);
  return output;
}

export { validatePreparedConfig };
