import { PackagelintUserConfig, PackagelintPreparedConfig } from '@packagelint/core';
import { accumulateRules } from './accumulateRules';

const defaultUserConfig: PackagelintUserConfig = {
  failOnErrorLevel: 'error',
  rules: ['@packagelint/core:always-fail'],
  outputs: {
    '@packagelint/core:internalDebug': true,
  },
};

/**
 * Expands, flattens, and resolves a User Config into a flat list of validate rules
 *
 * This is the high-level entry for packagelint's preparation step: it starts with a user-supplied config and finishes
 * with one that's ready for the validation step.
 */
function prepareConfig(actualProjectConfig: PackagelintUserConfig): PackagelintPreparedConfig {
  const finalUserConfig = {
    ...defaultUserConfig,
    ...actualProjectConfig,
  };

  // @TODO: Validate config
  console.log('finalUserConfig = ', finalUserConfig);

  // @TODO: Verbose option

  const preparedConfig = {
    ...finalUserConfig,
    rules: accumulateRules(finalUserConfig.rules),
  };
  return preparedConfig;
}

export { defaultUserConfig, prepareConfig };
