// UserConfig

import { PackagelintErrorLevel } from '../error-levels';
import {
  PackagelintPreparedRule,
  PackagelintRulePreparerConstructor,
  PackagelintRulePreparerInstance,
  PackagelintRuleValidatorConstructor,
  PackagelintRuleValidatorInstance,
} from '../internals';
import {
  PackagelintAnyReporterOptions,
  PackagelintReporterInstance,
  PackagelintReporterName,
} from '../reporters';
import { PackagelintRuleEntry, PackagelintRulesetEntry } from '../rules';

/**
 * An unprocessed config, usually from a .packagelintrc file (after merging with defaults). This drives everything
 * about Packagelint: nothing will be loaded or evaluated unless it's specified here, either directly or indirectly.
 */
export interface PackagelintUserConfig {
  /** Controls the exit code of the `packagelint` cli: it will exit 1 if any rule fails at or above the specified level */
  failOnErrorLevel: PackagelintErrorLevel;
  /** The rules and rulesets to run, specified as config objects or in shorthand. */
  rules: Array<PackagelintRuleEntry | PackagelintRulesetEntry>;
  /** Result reporters and their configs, keyed by name */
  reporters: Record<PackagelintReporterName, PackagelintAnyReporterOptions>;

  /** Internal implementation, for forking or hotfixing. Do not touch unless you're sure of what you're doing. */
  _RulePreparer: PackagelintRulePreparerConstructor;
  /** Internal implementation, for forking or hotfixing. Do not touch unless you're sure of what you're doing. */
  _RuleValidator: PackagelintRuleValidatorConstructor;

  // @TODO: aliases, reporterAliases
}

/**
 * After all rule entries have been loaded, rulesets expanded and flattened, configs merged, reporters initialized,
 * and self-checks completed, the original UserConfig becomes a PreparedConfig.
 * This is what drives the validation step.
 */
export interface PackagelintPreparedConfig {
  failOnErrorLevel: PackagelintErrorLevel;
  rules: Array<PackagelintPreparedRule>;
  reporters: Array<PackagelintReporterInstance>;
  rulePreparerInstance: PackagelintRulePreparerInstance;
  ruleValidatorInstance: PackagelintRuleValidatorInstance;
}
