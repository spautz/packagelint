import { PackagelintOutput, PackagelintPreparedConfig } from '@packagelint/core';

import { isFunction } from '../util';

function validatePreparedConfig(
  preparedConfig: PackagelintPreparedConfig,
): Promise<PackagelintOutput> {
  const { ruleValidatorInstance } = preparedConfig;

  if (!ruleValidatorInstance) {
    throw new Error('Packagelint internal error: Missing ruleValidatorInstance in preparedConfig');
  }
  if (
    !ruleValidatorInstance.validatePreparedConfig ||
    !isFunction(ruleValidatorInstance.validatePreparedConfig)
  ) {
    throw new Error('Packagelint internal error: Invalid ruleValidatorInstance in preparedConfig');
  }

  const output = ruleValidatorInstance.validatePreparedConfig(preparedConfig);
  return output;
}

export { validatePreparedConfig };
