import { PackagelintErrorLevel } from '../error-levels/errorLevels';
import {
  PackagelintRulePreparerConstructor,
  PackagelintRulePreparerInstance,
} from '../internals/rulePreparer';
import {
  PackagelintRuleValidatorConstructor,
  PackagelintRuleValidatorInstance,
} from '../internals/ruleValidator';
import { PackagelintReporterInstance } from '../reporters/reporterInstance';
import { PackagelintPreparedRule } from '../rules/preparedRule';

import { PackagelintUserConfig } from './userConfig';

/**
 * After all rule entries have been loaded, rulesets expanded and flattened, configs merged, reporters initialized,
 * and self-checks completed, the original UserConfig becomes a PreparedConfig.
 * This is what drives the validation step.
 */
export interface PackagelintPreparedConfig {
  // Values from the UserConfig
  originalUserConfig: PackagelintUserConfig;
  failOnErrorLevel: PackagelintErrorLevel;
  originalRules: PackagelintUserConfig['rules'];
  originalReporters: PackagelintUserConfig['reporters'];

  moduleAllowList: PackagelintUserConfig['moduleAllowList'];
  moduleDenyList: PackagelintUserConfig['moduleDenyList'];
  moduleAllowListErrorLevel: PackagelintUserConfig['moduleAllowListErrorLevel'];
  moduleDenyListErrorLevel: PackagelintUserConfig['moduleDenyListErrorLevel'];
  ruleAliases: PackagelintUserConfig['ruleAliases'];
  reporterAliases: PackagelintUserConfig['reporterAliases'];

  // Results of preparation
  preparedRules: Array<PackagelintPreparedRule>;
  reporterInstances: Array<PackagelintReporterInstance>;

  // Internals
  _RulePreparer: PackagelintRulePreparerConstructor;
  _rulePreparerInstance: PackagelintRulePreparerInstance;
  _RuleValidator: PackagelintRuleValidatorConstructor;
  _ruleValidatorInstance: PackagelintRuleValidatorInstance;
}
