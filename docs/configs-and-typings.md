# Config Typings for Packagelint

This article walks through the different config objects that Packagelint consumes while validating rules.

## UserConfig: Initial input

The `.packagelint.js` file in the root of your package supplies your UserConfig. This lists the rules and rulesets that
will be validated against, along with any options or overrides for them, and any global options for Packagelint itself.

The User Config is the entry point: no rules are enabled unless they're enabled here, either directly or via a Ruleset
that the Packagelint config enables.

```typescript
export interface PackagelintUserConfig {
  /** Controls the exit code of the `packagelint` cli: it will exit 1 if any rule fails at or above the specified level */
  failOnErrorLevel: 'exception' | 'error' | 'warn' | 'suggestion' | 'ignore';
  /** The rules and rulesets to run, specified as config objects or in shorthand. */
  rules: Array<PackagelintRuleEntry | PackagelintRulesetEntry>;
  /** Result reporters and their configs */
  reporters: Record<PackagelintReporterName, PackagelintAnyReporterOptions>;
}
```

### RuleEntry and RuleConfig

Configures a Rule Definition so that it may be run. It may be given in shorthand:

- A simple string will enable the rule, with its default options
- An array with a boolean will enable or disable the rule, with its default options
- An array with a string will enable the rule, with its default options, and set its errorLevel
- An array with an object will enable the rule and set its options
- A full object allows you to customize options, errorLevel, and whatever other settings you wish

```typescript
export type PackagelintRuleEntry<OptionsType extends PackagelintAnyRuleOptions> =
  | PackagelintRuleName
  | [PackagelintRuleName, boolean]
  | [PackagelintRuleName, 'exception' | 'error' | 'warn' | 'suggestion' | 'ignore']
  | [PackagelintRuleName, OptionsType]
  | PackagelintRuleConfig<OptionsType>;
```

Each RuleEntry is expanded to a full config:

```typescript
export type PackagelintRuleConfig<OptionsType extends PackagelintAnyRuleOptions> = {
  /** The rule's unique identifier. If this matches an existing RuleConfig or a RuleDefinition then it will apply
   * settings to that rule. If it is a new, unrecognized value then `extendRule` must be specified. */
  name: PackagelintRuleName;
  /** Whether or not to run the rule during validation */
  enabled?: boolean;
  /** When creating a copy of a rule, to give it different options or a different errorLevel, its implementation and
   * default options will be copied from the base rule name. `name` must be a new, unrecognized value to do this. */
  extendRule?: PackagelintRuleName;
  /** If the rule fails, the errorLevel that its failure is reported as */
  errorLevel?: 'exception' | 'error' | 'warn' | 'suggestion' | 'ignore';
  /** Rule-specific options */
  options?: OptionsType;
  /** When making a new copy of a rule via `extendRule`, this controls whether the base rule's current options are
   * used, or whether its original defaultOptions are used. */
  resetOptions?: boolean;
  /** If the rule fails validation, the error message will be generated from these messages. They may be customized
   * to support different language translations. */
  messages?: Record<string, string>;
};
```

### RulesetEntry and RulesetConfig

Rulesets do not yet support as many options as individual rules. Options, errorLevel overrides, and dynamic rule lists
will come in a future update.

```typescript
export type PackagelintRulesetEntry =
  | PackagelintRuleName
  | [PackagelintRuleName, boolean]
  | PackagelintRulesetConfig;
```

Each RulesetEntry is expanded to a full config:

```typescript
export type PackagelintRulesetConfig = {
  name: PackagelintRuleName;
  enabled?: boolean;
};
```

## RuleDefinition: What libraries provide

Each RuleDefinition provides the implementation and any default options for one rule. The rule will not be enabled
unless the UserConfig contains a RuleConfig for it (either directly or through a RulesetConfig). This is merged with the
RuleConfig to become a PreparedRule, which can then be evaluated.

This will generally come from an external package.

```typescript
export interface PackagelintRuleDefinition<OptionsType extends PackagelintAnyRuleOptions> {
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
  defaultErrorLevel?: 'exception' | 'error' | 'warn' | 'suggestion' | 'ignore';
  /* Options for the rule, if not overridden by the user config or a ruleset */
  defaultOptions: OptionsType;
  /* Human-readable messages for failed validate results */
  messages: Record<string, string>;
  /* Function that implements the rule's checks */
  doValidation: PackagelintValidationFn<OptionsType>;
}
```

## After Preparing

The rules and rulesets in the User Config are expanded, flattened, and resolved, becoming a list of ready-to-run
validations:

```typescript
interface PackagelintPreparedConfig {
  failOnErrorLevel: 'exception' | 'error' | 'warn' | 'suggestion' | 'ignore';
  rules: Array<PackagelintPreparedRule>;
  reporters: Array<PackagelintReporterInstance>;
}
```

```typescript
interface PackagelintPreparedRule {
  preparedRuleName: PackagelintRuleName;
  docs: {
    description: string;
    [key: string]: string;
  };
  enabled: boolean;
  extendedFrom: PackagelintRuleName | null; // from extendRule
  defaultErrorLevel: PackagelintErrorLevel;
  errorLevel: ErrorLevel; // from errorLevel + defaultErrorLevel
  defaultOptions: OptionsType;
  options: OptionsType; // from options + globalOptions + defaultOptions, mediated by resetOptions
  messages: Record<string, string>;
  doValidation: (
    options,
    packagelintContext,
  ) => PackagelintValidationResult | Promise<PackagelintValidationResult>;
}
```

## Validation Results

```typescript
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
```

```typescript
export type PackagelintValidationResult<ErrorDataType extends PackagelintAnyErrorData> =
  PackagelintValidationError<ErrorDataType> | null;

export interface PackagelintValidationError<ErrorDataType extends PackagelintAnyErrorData> {
  preparedRuleName: PackagelintRuleName;
  errorLevel: PackagelintErrorLevel;
  errorName: string | null;
  errorData: ErrorDataType | null;
  message: string;
}
```
