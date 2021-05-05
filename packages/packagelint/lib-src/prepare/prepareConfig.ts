import { PackagelintUserConfig, PackagelintPreparedConfig } from '@packagelint/types';

import { broadcastEventUsingReporters, prepareReporters } from '../report';
import { accumulateRules } from './accumulateRules';

const defaultUserConfig: PackagelintUserConfig = {
  failOnErrorLevel: 'error',
  rules: ['@packagelint/core:always-fail'],
  reporters: {
    '@packagelint/core:internalDebugReporter': true,
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

  const reporters = prepareReporters(finalUserConfig);

  // @TODO: Validate config

  broadcastEventUsingReporters(reporters, 'onConfigStart', finalUserConfig);

  // @TODO: Verbose option

  const preparedConfig = {
    ...finalUserConfig,
    rules: accumulateRules(finalUserConfig),
    reporters,
  };

  broadcastEventUsingReporters(reporters, 'onConfigReady', preparedConfig);
  return preparedConfig;
}

export { defaultUserConfig, prepareConfig };
