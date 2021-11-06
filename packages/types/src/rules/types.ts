import { PackagelintErrorLevel } from '../error-levels';
import { PackagelintAnyErrorData, PackagelintUnknownErrorData } from '../results';

export type PackagelintRuleName = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PackagelintAnyRuleOptions = Record<string, any>;
export type PackagelintUnknownRuleOptions = Record<string, unknown>;

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
  /** @TODO */
  entityType?: string;
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

// RulesetDefinition

export interface PackagelintRulesetDefinition {
  /* Unique identifier for the ruleset */
  name: PackagelintRuleName;
  /** @TODO */
  entityType?: string;
  /* Human-readable information about the rule */
  docs: {
    description: string;
    [key: string]: string;
  };
  rules: Array<PackagelintRuleEntry | PackagelintRulesetEntry>;

  // @TODO: errorLevel?: PackagelintErrorLevel;
}

export type PackagelintValidationFnReturn<
  ErrorDataType extends PackagelintAnyErrorData = PackagelintUnknownErrorData,
> = [string, ErrorDataType] | null | undefined;

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
