// General Utility Types

export type PackagelintErrorLevel = 'exception' | 'error' | 'warn' | 'log' | 'ignore';
export type PackagelintRuleName = string;

type PackagelintUnknownOptions = Record<string, unknown>;
type PackagelintUnknownErrorData = Record<string, unknown>;

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
  /* Human-readable messages for failed validation results */
  messages: Record<string, string>;
  /* Function that implements the rule's checks. Required unless extending another rule */
  doValidation: PackagelintValidationFn<OptionsType>;

  // @TODO: optionsSchema: Record<keyof OptionsType, string>;
}

export type PackagelintRuleConfig<OptionsType = PackagelintUnknownOptions> =
  | PackagelintRuleName
  | [PackagelintRuleName, OptionsType]
  | {
      name: PackagelintRuleName;
      enabled?: boolean;
      extendRule?: PackagelintRuleName;
      errorLevel?: PackagelintErrorLevel;
      options?: OptionsType;
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
  | {
      name: PackagelintRuleName;
      enabled?: boolean;
      errorLevel?: PackagelintErrorLevel;

      // @TODO: globalOptions?: OptionsType;
    };

// After Processing

export interface PackagelintProcessedConfig {
  failOnErrorLevel: PackagelintErrorLevel;
  rules: Array<PackagelintProcessedRule>;
}

export interface PackagelintProcessedRule<OptionsType = PackagelintUnknownOptions> {
  ruleName: PackagelintRuleName;
  docs: {
    description: string;
    [key: string]: string;
  };
  enabled: boolean;
  extendedFrom: string;
  errorLevel: PackagelintErrorLevel;
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
  | PackagelintValidationResult<ErrorDataType>
  | Promise<PackagelintValidationResult<ErrorDataType>>;

export type PackagelintValidationContext<ErrorDataType = PackagelintUnknownErrorData> = {
  createErrorToReturn: (
    errorName: string,
    ...extraErrorData: Array<ErrorDataType>
  ) => PackagelintValidationError;
  findFileUp: (fileGlob: string) => Promise<null | Array<string>>;
  setErrorData: (errorData: ErrorDataType, ...extraErrorData: Array<ErrorDataType>) => void;
};

export type PackagelintValidationResult<ErrorDataType = PackagelintUnknownErrorData> =
  | PackagelintValidationError<ErrorDataType>
  | null
  | undefined;

export interface PackagelintValidationError<ErrorDataType = PackagelintUnknownErrorData> {
  ruleName: PackagelintRuleName;
  errorLevel: PackagelintErrorLevel;
  errorData: ErrorDataType;
  message: string;
}
