import {
  PackagelintException_Internal,
  PackagelintOutput,
  PackagelintPreparedConfig,
} from '@packagelint/types';

import { isFunction } from '../util';

function validatePreparedConfig(
  preparedConfig: PackagelintPreparedConfig,
): Promise<PackagelintOutput> {
  const { ruleValidatorInstance } = preparedConfig;

  if (!ruleValidatorInstance) {
    throw new PackagelintException_Internal('Missing ruleValidatorInstance in preparedConfig');
  }
  if (
    !ruleValidatorInstance.validatePreparedConfig ||
    !isFunction(ruleValidatorInstance.validatePreparedConfig)
  ) {
    throw new PackagelintException_Internal('Invalid ruleValidatorInstance in preparedConfig');
  }

  const output = ruleValidatorInstance.validatePreparedConfig(preparedConfig);
  return output;
}

export { validatePreparedConfig };
