import {
  PackagelintAnyRuleOptions,
  PackagelintOutput,
  PackagelintPreparedConfig,
  PackagelintPreparedRule,
  PackagelintUserConfig,
  PackagelintValidationResult,
} from '../types';

export type PackagelintReporterName = string;

export type PackagelintReporterEventName =
  | 'onConfigStart'
  | 'onConfigReady'
  | 'onValidationStart'
  | 'onValidationComplete'
  | 'onRuleStart'
  | 'onRuleResult'
  | 'getLastError';

export type PackagelintAnyReporterOptions = any;
export type PackagelintUnknownReporterOptions = unknown;

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
  OptionsType extends PackagelintAnyRuleOptions = any,
> {
  new (options: OptionsType): PackagelintReporterInstance;
}
/**
 * A PackagelintReporterInstance may be created from functions
 */
export type PackagelintReporterConstructorFunction<
  OptionsType extends PackagelintAnyRuleOptions = any,
> = (options: OptionsType) => PackagelintReporterInstance;
/**
 * A PackagelintReporterInstance may be created from either classes or functions
 */
export type PackagelintReporterConstructor<OptionsType extends PackagelintAnyRuleOptions = any> =
  | PackagelintReporterClassConstructor<OptionsType>
  | PackagelintReporterConstructorFunction<OptionsType>;
