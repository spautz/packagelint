import {
  PackagelintUserConfig,
  PackagelintPreparedConfig,
  PackagelintRulePreparerInstance,
} from '@packagelint/core';

import {
  broadcastEventUsingReporters,
  constructClassOrFunction,
  prepareReporters,
} from '../report';
import { defaultUserConfig } from '../defaultUserConfig';
import {
  DefaultRulePreparer,
  PackageLintRuleValidator_InternalPrepareError,
} from './DefaultRulePreparer';
import { DefaultRuleValidator } from '../validate';
import { isFunction } from '../util';

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
  const { RulePreparer, RuleValidator } = finalUserConfig;

  const reporters = await prepareReporters(finalUserConfig);

  // @TODO: Validate config

  await broadcastEventUsingReporters(reporters, 'onConfigStart', finalUserConfig);

  // @TODO: Verbose option

  const rulePreparerInstance = constructClassOrFunction(RulePreparer || DefaultRulePreparer);
  const ruleValidatorInstance = constructClassOrFunction(RuleValidator || DefaultRuleValidator);

  const preparedConfig = await prepareConfigRules(finalUserConfig, rulePreparerInstance);
  preparedConfig.reporters = reporters;
  preparedConfig.rulePreparerInstance = rulePreparerInstance;
  preparedConfig.ruleValidatorInstance = ruleValidatorInstance;

  if (!preparedConfig || !preparedConfig.rules || !Array.isArray(preparedConfig)) {
    throw new PackageLintRuleValidator_InternalPrepareError(
      'Packagelint internal error: Invalid result from prepareConfigRules',
    );
  }

  await broadcastEventUsingReporters(reporters, 'onConfigReady', preparedConfig);
  return preparedConfig;
}

function prepareConfigRules(
  userConfig: PackagelintUserConfig,
  rulePreparerInstance: PackagelintRulePreparerInstance,
): Promise<PackagelintPreparedConfig> {
  if (!rulePreparerInstance) {
    throw new PackageLintRuleValidator_InternalPrepareError(
      'Packagelint internal error: Missing rulePreparerInstance',
    );
  }
  if (
    !rulePreparerInstance.prepareUserConfig ||
    !isFunction(rulePreparerInstance.prepareUserConfig)
  ) {
    throw new PackageLintRuleValidator_InternalPrepareError(
      'Packagelint internal error: Invalid rulePreparerInstance',
    );
  }

  const preparedConfig = rulePreparerInstance.prepareUserConfig(userConfig);
  return preparedConfig;
}

export { prepareConfig, prepareConfigRules };
