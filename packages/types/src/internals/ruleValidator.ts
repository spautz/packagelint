/**
 * Validation is performed via functions within a class or closure, to make it easier for forks to extend or override
 * separate pieces of the internal implementation. All of the functions marked as optional here exist in the
 * DefaultRuleValidator, although only `validatePreparedConfig` will be called from outside.
 */
import { PackagelintPreparedConfig } from '../configs/preparedConfig';
import { PackagelintOutput } from '../results/output';
import {
  PackagelintRuleCheckValidationFnContext,
  PackagelintRuleCheckValidationFnReturn,
} from '../rules/ruleCheck';
import { PackagelintValidationResult } from '../results/validationResult';
import { PackagelintPreparedRule } from '../rules/preparedRule';

export interface PackagelintRuleValidatorInstance {
  readonly validatePreparedConfig: (
    preparedConfig: PackagelintPreparedConfig,
  ) => Promise<PackagelintOutput>;

  // These exist in the default implementation, but are not part of the API contract used by validatePreparedConfig().
  // These all implicitly use the preparedConfig passed into `validatePreparedConfig`, and will not work standalone.

  readonly _makeValidationContext?: (
    preparedRule: PackagelintPreparedConfig,
  ) => PackagelintRuleCheckValidationFnContext;

  readonly _validateAllRules?: () => Promise<Array<PackagelintValidationResult>>;

  // @TODO: Maybe promote this to a required/supported helper, to allow async buildup of rules when using API?
  readonly _validateOneRule?: (
    preparedRule: PackagelintPreparedRule,
  ) => Promise<PackagelintValidationResult>;

  readonly _beforeRule?: (preparedRule: PackagelintPreparedRule) => Promise<Array<void | unknown>>;

  readonly _processRuleResult?: (
    preparedRule: PackagelintPreparedRule,
    rawResult: PackagelintRuleCheckValidationFnReturn | Error,
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
