import { PackagelintUserConfig, PackagelintPreparedConfig } from '@packagelint/core';

import { broadcastEventUsingReporters, prepareReporters } from '../report';
import { accumulateRules } from './accumulateRules';
import { defaultUserConfig } from './defaultUserConfig';

/**
 * Expands, flattens, and resolves a User Config into a flat list of validate rules
 *
 * This is the high-level entry for packagelint's preparation step: it starts with a user-supplied config and finishes
 * with one that's ready for the validation step.
 */
async function prepareConfig(
  actualProjectConfig: PackagelintUserConfig,
): Promise<PackagelintPreparedConfig> {
  const finalUserConfig = {
    ...defaultUserConfig,
    ...actualProjectConfig,
  };

  const reporters = prepareReporters(finalUserConfig);

  // @TODO: Validate config

  await broadcastEventUsingReporters(reporters, 'onConfigStart', finalUserConfig);

  // @TODO: Verbose option

  const preparedConfig = {
    ...finalUserConfig,
    rules: accumulateRules(finalUserConfig),
    reporters,
  };

  await broadcastEventUsingReporters(reporters, 'onConfigReady', preparedConfig);
  return preparedConfig;
}

export { defaultUserConfig, prepareConfig };
