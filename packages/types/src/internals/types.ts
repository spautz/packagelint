import { PackagelintErrorLevel } from '../error-levels';
import {
  PackagelintAnyRuleOptions,
  PackagelintRuleDefinition,
  PackagelintRuleEntry,
  PackagelintRuleName,
  PackagelintRulesetDefinition,
  PackagelintRulesetEntry,
  PackagelintUnknownRuleOptions,
  PackagelintValidationContext,
  PackagelintValidationFnReturn,
} from '../rules';
import { PackagelintPreparedConfig, PackagelintUserConfig } from '../configs';
import { PackagelintOutput, PackagelintValidationResult } from '../results';

export interface PackagelintPreparedRule<
  OptionsType extends PackagelintAnyRuleOptions = PackagelintUnknownRuleOptions,
> {
  preparedRuleName: PackagelintRuleName;
  docs: PackagelintRuleDefinition<OptionsType>['docs'];
  enabled: boolean;
  extendedFrom: PackagelintRuleName | null;
  defaultErrorLevel: PackagelintErrorLevel;
  errorLevel: PackagelintErrorLevel;
  defaultOptions: OptionsType;
  options: OptionsType;
  messages: PackagelintRuleDefinition<OptionsType>['messages'];
  doValidation: PackagelintRuleDefinition<OptionsType>['doValidation'];
}

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
    ruleEntry: PackagelintRuleEntry | PackagelintRulesetEntry,
  ) => Promise<PackagelintPreparedRule | Array<PackagelintPreparedRule>>;

  readonly _importRule?: (
    name: PackagelintRuleName,
  ) => Promise<PackagelintRuleDefinition | PackagelintRulesetDefinition>;

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

// Validation Runner: PackagelintRuleValidator

/**
 * Validation is performed via functions within a class or closure, to make it easier for forks to extend or override
 * separate pieces of the internal implementation. All of the functions marked as optional here exist in the
 * DefaultRuleValidator, although only `validatePreparedConfig` will be called from outside.
 */
export interface PackagelintRuleValidatorInstance {
  readonly validatePreparedConfig: (
    preparedConfig: PackagelintPreparedConfig,
  ) => Promise<PackagelintOutput>;

  // These exist in the default implementation, but are not part of the API contract used by validatePreparedConfig().
  // These all implicitly use the preparedConfig passed into `validatePreparedConfig`, and will not work standalone.

  readonly _makeValidationContext?: (
    preparedRule: PackagelintPreparedRule,
  ) => PackagelintValidationContext;

  readonly _validateAllRules?: () => Promise<Array<PackagelintValidationResult>>;

  // @TODO: Maybe promote this to a required/supported helper, to allow async buildup of rules when using API?
  readonly _validateOneRule?: (
    preparedRule: PackagelintPreparedRule,
  ) => Promise<PackagelintValidationResult>;

  readonly _beforeRule?: (preparedRule: PackagelintPreparedRule) => Promise<Array<void | unknown>>;

  readonly _processRuleResult?: (
    preparedRule: PackagelintPreparedRule,
    rawResult: PackagelintValidationFnReturn | Error,
  ) => PackagelintValidationResult;

  readonly _afterRule?: (
    preparedRule: PackagelintPreparedRule,
    result: PackagelintValidationResult,
  ) => Promise<Array<void | unknown>>;

  readonly _getRawResults?: () => Array<PackagelintValidationResult>;

  readonly _getValidationOutput?: () => PackagelintOutput;
}

/**
 * A PackagelintRuleValidatorInstance may be created from classes
 */
export interface PackagelintRuleValidatorClassConstructor {
  new (): PackagelintRuleValidatorInstance;
}
/**
 * A PackagelintRuleValidatorInstance may be created from functions
 */
export type PackagelintRuleValidatorConstructorFunction = () => PackagelintRuleValidatorInstance;
/**
 * A PackagelintRuleValidatorInstance may be created from either classes or functions
 */
export type PackagelintRuleValidatorConstructor =
  | PackagelintRuleValidatorClassConstructor
  | PackagelintRuleValidatorConstructorFunction;
