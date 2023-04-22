import { PackagelintOutput } from '../results/output';
import { PackagelintValidationResult } from '../results/validationResult';
import { PackagelintUserConfig } from '../configs/userConfig';
import { PackagelintPreparedConfig } from '../configs/preparedConfig';
import { PackagelintPreparedRule } from '../rules/preparedRule';

export type PackagelintReporterName = string;

export type PackagelintUnknownReporterOptions = Record<string, unknown>;

// Result reporters

/**
 * Reporters *should* return nothing, but if any do return a value then we'll pass it back through
 */
export type PackagelintUnknownReporterReturnValue = Promise<void | unknown> | void | unknown;

/**
 *
 */
export interface PackagelintReporterInstance {
  /** @TODO */
  entityType?: string;

  readonly onConfigStart?: (
    userConfig: PackagelintUserConfig,
  ) => PackagelintUnknownReporterReturnValue;

  readonly onConfigReady?: (
    preparedConfig: PackagelintPreparedConfig,
  ) => PackagelintUnknownReporterReturnValue;

  readonly onValidationStart?: (
    preparedConfig: PackagelintPreparedConfig,
  ) => PackagelintUnknownReporterReturnValue;

  readonly onValidationComplete?: (
    fullResults: PackagelintOutput,
  ) => PackagelintUnknownReporterReturnValue;

  readonly onRuleStart?: (
    preparedRule: PackagelintPreparedRule,
  ) => PackagelintUnknownReporterReturnValue;

  readonly onRuleResult?: (
    preparedRule: PackagelintPreparedRule,
    ruleResult: PackagelintValidationResult,
  ) => PackagelintUnknownReporterReturnValue;

  readonly getLastError?: () => Error | void;
}

/**
 * A PackagelintReporterInstance may be created from classes
 */
export interface PackagelintReporterClassConstructor<
  OptionsType extends PackagelintUnknownReporterOptions = PackagelintUnknownReporterOptions,
> {
  new (options: OptionsType): PackagelintReporterInstance;
}
/**
 * A PackagelintReporterInstance may be created from functions
 */
export type PackagelintReporterConstructorFunction<
  OptionsType extends PackagelintUnknownReporterOptions = PackagelintUnknownReporterOptions,
> = (options: OptionsType) => PackagelintReporterInstance;
/**
 * A PackagelintReporterInstance may be created from either classes or functions
 */
export type PackagelintReporterConstructor<
  OptionsType extends PackagelintUnknownReporterOptions = PackagelintUnknownReporterOptions,
> =
  | PackagelintReporterClassConstructor<OptionsType>
  | PackagelintReporterConstructorFunction<OptionsType>;
