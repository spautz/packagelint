// General Utility Types

export type PackagelintErrorLevel = 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore';
export type PackagelintErrorLevelCounts = {
  exception: number;
  error: number;
  warning: number;
  suggestion: number;
  ignore: number;
};
export type PackagelintRuleName = string;

export type PackagelintUnknownOptions = Record<string, unknown>;
export type PackagelintUnknownErrorData = Record<string, unknown>;

// User Config

export interface PackagelintUserConfig {
  /* Controls the exit code of `packagelint`: it will exit 1 if any rule fails at or above the specified level */
  failOnErrorLevel: PackagelintErrorLevel;
  /* The rules and rulesets to run */
  rules: Array<PackagelintRuleConfig | PackagelintRulesetConfig>;
}

// Rules

export interface PackagelintRuleDefinition<OptionsType = PackagelintUnknownOptions> {
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
  /* Used to inherit the implementation of another rule, so that it gets its own name and options insetad of overriding
   * the original rule */
  extendRule?: PackagelintRuleName;
  /* Error level for the rule, if not overridden by the user config or a ruleset */
  defaultErrorLevel?: PackagelintErrorLevel;
  /* Options for the rule, if not overridden by the user config or a ruleset */
  defaultOptions: OptionsType;
  /* Human-readable messages for failed validate results */
  messages: Record<string, string>;
  /* Function that implements the rule's checks. Required unless extending another rule */
  doValidation: PackagelintValidationFn<OptionsType>;

  // @TODO: optionsSchema: Record<keyof OptionsType, string>;
}

export type PackagelintRuleConfig<OptionsType = PackagelintUnknownOptions> =
  | PackagelintRuleName
  | [PackagelintRuleName, boolean]
  | [PackagelintRuleName, OptionsType]
  | PackagelintRuleConfigObject<OptionsType>;

export type PackagelintRuleConfigObject<OptionsType = PackagelintUnknownOptions> = {
  name: PackagelintRuleName;
  enabled?: boolean;
  extendRule?: PackagelintRuleName;
  errorLevel?: PackagelintErrorLevel;
  options?: OptionsType;
  resetOptions?: boolean;
  messages?: Record<string, string>;
};

// Rulesets

export interface PackagelintRulesetDefinition {
  name: PackagelintRuleName;
  rules: Array<PackagelintRuleConfig | PackagelintRulesetConfig>;

  // @TODO: errorLevel?: PackagelintErrorLevel;
}

export type PackagelintRulesetConfig =
  | PackagelintRuleName
  | [PackagelintRuleName, boolean]
  | PackagelintRulesetConfigObject;

export type PackagelintRulesetConfigObject = {
  name: PackagelintRuleName;
  enabled?: boolean;
  errorLevel?: PackagelintErrorLevel;

  // @TODO: globalOptions?: OptionsType;
};

// After preparing config and loading rules

export interface PackagelintPreparedConfig {
  failOnErrorLevel: PackagelintErrorLevel;
  rules: Array<PackagelintPreparedRule>;
}

export interface PackagelintPreparedRule<OptionsType = PackagelintUnknownOptions> {
  ruleName: PackagelintRuleName;
  docs: {
    description: string;
    [key: string]: string;
  };
  enabled: boolean;
  extendedFrom: string | null;
  errorLevel: PackagelintErrorLevel;
  defaultOptions: OptionsType;
  options: OptionsType;
  messages: Record<string, string>;
  doValidation: PackagelintValidationFn;
}

// Validation

export type PackagelintValidationFn<
  OptionsType = PackagelintUnknownOptions,
  ErrorDataType = PackagelintUnknownErrorData
> = (
  options: OptionsType,
  packageContext: PackagelintValidationContext<ErrorDataType>,
) =>
  | PackagelintValidationFnReturn<ErrorDataType>
  | Promise<PackagelintValidationFnReturn<ErrorDataType>>;

export type PackagelintValidationContext<ErrorDataType = PackagelintUnknownErrorData> = {
  // General information
  ruleName: string;
  // Helpers so that rules don't have to implement everything themselves
  findFileUp: (fileGlob: string) => Promise<null | Array<string>>;
  // Setting errorData and returning errors
  createErrorToReturn: (
    errorName: string,
    extraErrorData?: ErrorDataType,
  ) => [string, ErrorDataType];
  setErrorData: (errorData: ErrorDataType) => void;
};

export type PackagelintValidationFnReturn<ErrorDataType = PackagelintUnknownErrorData> =
  | [string, ErrorDataType]
  | null
  | undefined;

export type PackagelintValidationResult<
  ErrorDataType = PackagelintUnknownErrorData
> = PackagelintValidationError<ErrorDataType> | null;

export interface PackagelintValidationError<ErrorDataType = PackagelintUnknownErrorData> {
  ruleName: PackagelintRuleName;
  errorLevel: PackagelintErrorLevel;
  errorName: string | null;
  errorData: ErrorDataType | null;
  message: string;
}

// Final results

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
  errorResults: Array<PackagelintValidationError>;
}
