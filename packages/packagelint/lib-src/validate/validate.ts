import { PackagelintOutput, PackagelintPreparedConfig } from '@packagelint/core';
import { PackagelintInternalException } from '@packagelint/types';

import { isFunction } from '../util';

function validatePreparedConfig(
  preparedConfig: PackagelintPreparedConfig,
): Promise<PackagelintOutput> {
  const { ruleValidatorInstance } = preparedConfig;

  if (!ruleValidatorInstance) {
    throw new PackagelintInternalException('Missing ruleValidatorInstance in preparedConfig');
  }
  if (
    !ruleValidatorInstance.validatePreparedConfig ||
    !isFunction(ruleValidatorInstance.validatePreparedConfig)
  ) {
    throw new PackagelintInternalException('Invalid ruleValidatorInstance in preparedConfig');
  }

  const output = ruleValidatorInstance.validatePreparedConfig(preparedConfig);
  return output;
}

export { validatePreparedConfig };
