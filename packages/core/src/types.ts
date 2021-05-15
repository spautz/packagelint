// General Utility Types

export type PackagelintErrorLevel = 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore';
export type PackagelintErrorLevelCounts = {
  exception: number;
  error: number;
  warning: number;
  suggestion: number;
  ignore: number;
};

export type PackagelintReporterEventName =
  | 'onConfigStart'
  | 'onConfigReady'
  | 'onValidationStart'
  | 'onValidationComplete'
  | 'onRuleStart'
  | 'onRuleResult'
  | 'getLastError';

export type PackagelintRuleName = string;
export type PackagelintReporterName = string;

export type PackagelintAnyRuleOptions = Record<string, any>;
export type PackagelintAnyErrorData = Record<string, any>;
export type PackagelintAnyReporterOptions = any;
export type PackagelintUnknownRuleOptions = Record<string, unknown>;
export type PackagelintUnknownErrorData = Record<string, unknown>;
export type PackagelintUnknownReporterOptions = unknown;

// Exports for Rules, Rulesets, and Reporters

// type FlexibleExportType<T> = T | Promise<T> | (() => T | Promise<T>);

export type PackagelintExportedRules = {
  packagelintRules: Record<string, PackagelintRuleDefinition | PackagelintRulesetDefinition>;
};
export type PackagelintExportedReporters = {
  packagelintReporters: Record<string, PackagelintReporterConstructor>;
};

// UserConfig

/**
 * An unprocessed config, usually from a .packagelintrc file. This drives everything about Packagelint:
 * nothing will be loaded or evaluated unless it's specified here, either directly or indirectly.
 */
export interface PackagelintUserConfig {
  /** Controls the exit code of the `packagelint` cli: it will exit 1 if any rule fails at or above the specified level */
  failOnErrorLevel: PackagelintErrorLevel;
  /** The rules and rulesets to run, specified as config objects or in shorthand. */
  rules: Array<PackagelintRuleEntry | PackagelintRulesetEntry>;
  /** Result reporters and their configs */
  reporters: Record<PackagelintReporterName, PackagelintAnyReporterOptions>;

  // @TODO: aliases, reporterAliases
}

// RuleEntry and RuleConfig

/**
 * When a rule is listed in the UserConfig or in a RuleSetDefinition, it may be given in shorthand:
 *  - A simple string will enable the rule, with its default options
 *  - An array with a boolean will enable or disable the rule, with its default options
 *  - An array with a string will enable the rule, with its default options, and set its errorLevel
 *  - An array with an object will enable the rule and set its options
 *  - A full object allows you to customize options, errorLevel, and whatever other settings you wish
 */
export type PackagelintRuleEntry<
  OptionsType extends PackagelintAnyRuleOptions = PackagelintUnknownRuleOptions,
> =
  | PackagelintRuleName
  | [PackagelintRuleName, boolean]
  | [PackagelintRuleName, PackagelintErrorLevel]
  | [PackagelintRuleName, OptionsType]
  | PackagelintRuleConfig<OptionsType>;

export type PackagelintRuleConfig<
  OptionsType extends PackagelintAnyRuleOptions = PackagelintUnknownRuleOptions,
> = {
  /** The rule's unique identifier. If this matches an existing RuleConfig or a RuleDefinition then it will apply
   * settings to that rule. If it is a new, unrecognized value then `extendRule` must be specified. */
  name: PackagelintRuleName;
  /** Whether or not to run the rule during validation */
  enabled?: boolean;
  /** When creating a copy of a rule, to give it different options or a different errorLevel, its implementation and
   * default options will be copied from the base rule name. `name` must be a new, unrecognized value to do this. */
  extendRule?: PackagelintRuleName;
  /** If the rule fails, the errorLevel that its failure is reported as */
  errorLevel?: PackagelintErrorLevel;
  /** Rule-specific options */
  options?: OptionsType;
  /** When making a new copy of a rule via `extendRule`, this controls whether the base rule's current options are
   * used, or whether its original defaultOptions are used. */
  resetOptions?: boolean;
  /** If the rule fails validation, the error message will be generated from these messages. They may be customized
   * to support different language translations. */
  messages?: Record<string, string>;
};

// RulesetEntry and RulesetConfig

/**
 * When a ruleset is listed in the UserConfig or in another RuleSetDefinition, it may be given in shorthand:
 *  - A simple string will expand the ruleset into its rules, as configured by the ruleset
 *  - An array with a boolean will enable or disable the ruleset
 *  - A full object allows you to customize options, errorLevel, and whatever other settings you wish
 */
export type PackagelintRulesetEntry =
  | PackagelintRuleName
  | [PackagelintRuleName, boolean]
  | PackagelintRulesetConfig;
// @TODO: Ruleset options, errorLevels, and dynamic generation

export type PackagelintRulesetConfig = {
  name: PackagelintRuleName;
  enabled?: boolean;
  errorLevel?: PackagelintErrorLevel;

  // @TODO: enabled, options, globalOptions?, errorLevel, globalErrorLevel?
};

// RuleDefinition and PreparedRule

/**
 * The underlying implementation of a rule. This gets merged with a RuleConfig to form a ProcessedRule.
 */
export interface PackagelintRuleDefinition<
  OptionsType extends PackagelintAnyRuleOptions = PackagelintUnknownRuleOptions,
> {
  /* Unique identifier for the rule */
  name: PackagelintRuleName;
  /* Human-readable information about the rule */
  docs: {
    description: string;
    [key: string]: string;
  };
  /* Whether the rule may be used directly, or whether it must first be extended to define a different rule. This is
   * used for generic rules that need to be invoked multiple times with different options, like `file-exists` */
  isAbstract?: boolean;
  /* Error level for the rule, if not overridden by the user config or a ruleset. Defaults to "error". */
  defaultErrorLevel?: PackagelintErrorLevel;
  /* Options for the rule, if not overridden by the user config or a ruleset */
  defaultOptions: OptionsType;
  /* Human-readable messages for failed validate results */
  messages: Record<string, string>;
  /* Function that implements the rule's checks */
  doValidation: PackagelintValidationFn<OptionsType>;

  // @TODO: optionsSchema: Record<keyof OptionsType, string>;
}

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

// RulesetDefinition

export interface PackagelintRulesetDefinition {
  /* Unique identifier for the ruleset */
  name: PackagelintRuleName;
  /* Human-readable information about the rule */
  docs: {
    description: string;
    [key: string]: string;
  };
  rules: Array<PackagelintRuleEntry | PackagelintRulesetEntry>;

  // @TODO: errorLevel?: PackagelintErrorLevel;
}

// Result reporters

/**
 * Reporters *should* return nothing, but if any do return a value then we'll pass it back through
 */
export type PackagelintUnknownReporterReturnValue = Promise<void | unknown> | void | unknown;

/**
 *
 */
export interface PackagelintReporter {
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
    ruleInfo: PackagelintPreparedRule,
  ) => PackagelintUnknownReporterReturnValue;

  readonly onRuleResult?: (
    ruleInfo: PackagelintPreparedRule,
    ruleResult: PackagelintValidationResult,
  ) => PackagelintUnknownReporterReturnValue;

  readonly getLastError?: () => Error | void;
}

/**
 * PackagelintReporter instances may be created from classes
 */
export interface PackagelintReporterClassConstructor<
  OptionsType extends PackagelintAnyRuleOptions = any,
> {
  new (options: OptionsType): PackagelintReporter;
}
/**
 * PackagelintReporter instances may be created from functions
 */
export type PackagelintReporterConstructorFunction<
  OptionsType extends PackagelintAnyRuleOptions = any,
> = (options: OptionsType) => PackagelintReporter;

/**
 * PackagelintReporter instances may be created from either classes or functions
 */
export type PackagelintReporterConstructor<OptionsType extends PackagelintAnyRuleOptions = any> =
  | PackagelintReporterClassConstructor<OptionsType>
  | PackagelintReporterConstructorFunction<OptionsType>;

// PreparedConfig: After preparing config and loading rules

export interface PackagelintPreparedConfig {
  failOnErrorLevel: PackagelintErrorLevel;
  rules: Array<PackagelintPreparedRule>;
  reporters: Array<PackagelintReporter>;
}

// Validation

export type PackagelintValidationFn<
  OptionsType extends PackagelintAnyRuleOptions = PackagelintUnknownRuleOptions,
  ErrorDataType extends PackagelintAnyErrorData = PackagelintUnknownErrorData,
> = (
  options: OptionsType,
  packageContext: PackagelintValidationContext<ErrorDataType>,
) =>
  | PackagelintValidationFnReturn<ErrorDataType>
  | Promise<PackagelintValidationFnReturn<ErrorDataType>>;

export type PackagelintValidationContext<
  ErrorDataType extends PackagelintAnyErrorData = PackagelintUnknownErrorData,
> = {
  // General information
  preparedRuleName: string;
  // Helpers so that rules don't have to implement everything themselves
  findFileUp: (fileGlob: string) => Promise<null | Array<string>>;
  // Setting errorData and returning errors
  createErrorToReturn: (
    errorName: string,
    extraErrorData?: ErrorDataType,
  ) => [string, ErrorDataType];
  setErrorData: (errorData: ErrorDataType) => void;
};

export type PackagelintValidationFnReturn<
  ErrorDataType extends PackagelintAnyErrorData = PackagelintUnknownErrorData,
> = [string, ErrorDataType] | null | undefined;

export type PackagelintValidationResult<
  ErrorDataType extends PackagelintAnyErrorData = PackagelintUnknownErrorData,
> = PackagelintValidationError<ErrorDataType> | null;

export interface PackagelintValidationError<
  ErrorDataType extends PackagelintAnyErrorData = PackagelintUnknownErrorData,
> {
  preparedRuleName: PackagelintRuleName;
  errorLevel: PackagelintErrorLevel;
  errorName: string | null;
  errorData: ErrorDataType | null;
  message: string;
}

// Final validation results

export interface PackagelintOutput {
  // Overall results
  numRules: number;
  numRulesPassed: number;
  numRulesFailed: number;
  exitCode: number;
  // Summary and detail information about error levels
  highestErrorLevel: PackagelintErrorLevel | null;
  errorLevelCounts: PackagelintErrorLevelCounts;
  // The full details used to generate the results
  rules: Array<PackagelintPreparedRule>;
  allResults: Array<PackagelintValidationResult>;
  errorResults: Array<PackagelintValidationError>;
}
