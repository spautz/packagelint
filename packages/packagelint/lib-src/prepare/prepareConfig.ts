import { PackagelintUserConfig, PackagelintPreparedConfig } from '@packagelint/core';

import {
  broadcastEventUsingReporters,
  constructClassOrFunction,
  prepareReporters,
} from '../report';
import { accumulateRules } from './accumulateRules';
import { defaultUserConfig } from './defaultUserConfig';
import { DefaultRuleValidator } from '../validate';

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
  const { RuleValidator } = finalUserConfig;

  const reporters = await prepareReporters(finalUserConfig);

  // @TODO: Validate config

  await broadcastEventUsingReporters(reporters, 'onConfigStart', finalUserConfig);

  // @TODO: Verbose option

  const ruleValidatorInstance = constructClassOrFunction(RuleValidator || DefaultRuleValidator);

  const preparedConfig = {
    ...finalUserConfig,
    rules: await accumulateRules(finalUserConfig),
    reporters,
    ruleValidatorInstance,
  };

  await broadcastEventUsingReporters(reporters, 'onConfigReady', preparedConfig);
  return preparedConfig;
}

export { defaultUserConfig, prepareConfig };
