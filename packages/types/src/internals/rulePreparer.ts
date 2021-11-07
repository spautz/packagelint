import { PackagelintUserConfig } from '../configs/userConfig';
import { PackagelintPreparedConfig } from '../configs/preparedConfig';
import { PackagelintRuleEntry } from '../configs/ruleEntry';
import { PackagelintPreparedRule } from '../rules/preparedRule';
import { PackagelintRuleCheckDefinition, PackagelintRuleName } from '../rules/ruleCheck';
import { PackagelintRuleSetDefinition } from '../rules/ruleSet';
import { PackagelintRuleComboDefinition } from '../rules/ruleCombo';

/**
 * Config+rule preparation is performed via functions within a class or closure, to make it easier for forks to extend
 * or override separate pieces of the internal implementation. All of the functions marked as optional here exist in
 * the DefaultRulePreparer, although only `prepareUserConfig` will be called from outside.
 */
export interface PackagelintRulePreparerInstance {
  readonly prepareUserConfig: (
    userConfig: PackagelintUserConfig,
  ) => Promise<PackagelintPreparedConfig>;

  // These exist in the default implementation, but are not part of the API contract used by validatePreparedConfig().
  // These all implicitly use the preparedConfig passed into `validatePreparedConfig`, and will not work standalone.

  // @TODO: Maybe promote this to a required/supported helper, to allow async buildup of rules when using API?
  readonly _processRuleEntry?: (
    ruleEntry: PackagelintRuleEntry,
  ) => Promise<PackagelintPreparedRule | Array<PackagelintPreparedRule>>;

  readonly _importRule?: (
    name: PackagelintRuleName,
  ) => Promise<
    PackagelintRuleCheckDefinition | PackagelintRuleComboDefinition | PackagelintRuleSetDefinition
  >;

  // @TODO
  // readonly _processRuleConfig?: (
  //   ruleConfig: PackagelintRuleConfig,
  // ) => Promise<PackagelintPreparedRule>;

  // @TODO
  // readonly _processRulesetConfig?: (
  //   rulesetConfig: PackagelintRulesetConfig,
  // ) => Promise<Array<PackagelintPreparedRule>>;

  readonly _getPreparedRuleList?: () => Array<PackagelintPreparedRule>;

  readonly _getPreparedConfig?: () => PackagelintPreparedConfig;
}

/**
 * A PackagelintRulePreparerInstance may be created from classes
 */
export interface PackagelintRulePreparerClassConstructor {
  new (): PackagelintRulePreparerInstance;
}
/**
 * A PackagelintRulePreparerInstance may be created from functions
 */
export type PackagelintRulePreparerConstructorFunction = () => PackagelintRulePreparerInstance;
/**
 * A PackagelintRulePreparerInstance may be created from either classes or functions
 */
export type PackagelintRulePreparerConstructor =
  | PackagelintRulePreparerClassConstructor
  | PackagelintRulePreparerConstructorFunction;
