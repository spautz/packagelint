import {
  PackagelintException_Internal,
  PackagelintPreparedConfig,
  PackagelintRulePreparerInstance,
  PackagelintUserConfig,
  isFunction,
  PackagelintRuleValidatorInstance,
} from '@packagelint/types';

import {
  broadcastEventUsingReporters,
  constructClassOrFunction,
  prepareReporters,
} from '../report';
import { defaultUserConfig } from '../defaultUserConfig';
import { DefaultRulePreparer } from './DefaultRulePreparer';
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
  const { _RulePreparer, _RuleValidator } = finalUserConfig;

  const reporters = await prepareReporters(finalUserConfig);

  // @TODO: Validate config

  await broadcastEventUsingReporters(reporters, 'onConfigStart', finalUserConfig);

  // @TODO: Verbose option

  const rulePreparerInstance: PackagelintRulePreparerInstance = constructClassOrFunction(
    _RulePreparer || DefaultRulePreparer,
  );
  const ruleValidatorInstance: PackagelintRuleValidatorInstance = constructClassOrFunction(
    _RuleValidator || DefaultRuleValidator,
  );

  const preparedConfig = await prepareConfigRules(finalUserConfig, rulePreparerInstance);
  preparedConfig.reporters = reporters;
  preparedConfig.rulePreparerInstance = rulePreparerInstance;
  preparedConfig.ruleValidatorInstance = ruleValidatorInstance;

  if (!preparedConfig || !preparedConfig.rules || !Array.isArray(preparedConfig.rules)) {
    throw new PackagelintException_Internal('Invalid result from prepareConfigRules');
  }

  await broadcastEventUsingReporters(reporters, 'onConfigReady', preparedConfig);
  return preparedConfig;
}

function prepareConfigRules(
  userConfig: PackagelintUserConfig,
  rulePreparerInstance: PackagelintRulePreparerInstance,
): Promise<PackagelintPreparedConfig> {
  if (!rulePreparerInstance) {
    throw new PackagelintException_Internal('Missing rulePreparerInstance');
  }
  if (
    !rulePreparerInstance.prepareUserConfig ||
    !isFunction(rulePreparerInstance.prepareUserConfig)
  ) {
    throw new PackagelintException_Internal('Invalid rulePreparerInstance');
  }

  const preparedConfig = rulePreparerInstance.prepareUserConfig(userConfig);
  return preparedConfig;
}

export { prepareConfig, prepareConfigRules };
