import { PackagelintOutput, PackagelintPreparedConfig } from '@packagelint/core';

import { PackageLintInternalError, isFunction } from '../util';

function validatePreparedConfig(
  preparedConfig: PackagelintPreparedConfig,
): Promise<PackagelintOutput> {
  const { ruleValidatorInstance } = preparedConfig;

  if (!ruleValidatorInstance) {
    throw new PackageLintInternalError('Missing ruleValidatorInstance in preparedConfig');
  }
  if (
    !ruleValidatorInstance.validatePreparedConfig ||
    !isFunction(ruleValidatorInstance.validatePreparedConfig)
  ) {
    throw new PackageLintInternalError('Invalid ruleValidatorInstance in preparedConfig');
  }

  const output = ruleValidatorInstance.validatePreparedConfig(preparedConfig);
  return output;
}

export { validatePreparedConfig };
