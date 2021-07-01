# Packagelint Types: Configs

## Overview

The `.packagelint.js` file in the root of your package supplies the **UserConfig**. This lists the rules and rulesets
that will be validated against -- each as a **RuleEntry** -- along with any options or overrides for them, and any
global options for Packagelint itself.

The UserConfig is the entry point: no rules are run unless they're enabled here.

The rules and rulesets in the UserConfig are expanded, flattened, and resolved, becoming a list of ready-to-run
validations: the **PreparedConfig**. Because a rule's configuration can be overridden later, no rules are evaluated
until after all have been prepared.

## PackagelintUserConfig

```typescript
/**
 * An unprocessed config, usually from a .packagelintrc file (after merging with defaults). This drives everything
 * about Packagelint: nothing will be loaded or evaluated unless it's specified here, either directly or indirectly.
 */
interface PackagelintUserConfig {
  // Common options
  /** Controls the exit code of the `packagelint` cli: it will exit 1 if any rule fails at or above the specified level */
  failOnErrorLevel: 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore';
  /** The rules and rulesets to run, specified as config objects or in shorthand. */
  rules: Array<PackagelintRuleEntry>;
  /** Result reporters and their configs, keyed by name */
  reporters: Record<string, PackagelintAnyReporterOptions>;

  // Uncommon options
  /** Maps a module or rule name to another. Useful for replacing a rule's implementation */
  aliases: Record<string, string>;
  /** Maps a module or reporter name to another. Useful for replacing a reporter's implementation */
  reporterAliases: Record<string, string>;

  // Danger zone
  /** Internal implementation, for forking or hotfixing. Do not touch unless you're sure of what you're doing. */
  _RulePreparer: PackagelintRulePreparerConstructor;
  /** Internal implementation, for forking or hotfixing. Do not touch unless you're sure of what you're doing. */
  _RuleValidator: PackagelintRuleValidatorConstructor;
}
```

### How to use it

Most projects will only need to set the first two or three fields above: the rest will be filled in with defaults.

The aliases can be used to hotfix and replace one module with another -- if you fork `@packagelint/core` or another
module that provides rules or reporters, for example, you can create an alias so that rules/reporters imported from
`@packagelint/core` will instead be imported from a different package name. This is uncommon.

If you need to rewrite, replace, or extend the Packagelint internals, you can inject your own implementations via
`_RulePreparer` and `_RuleValidator`. This is an easier alternative to forking `@packagelint/packagelint` itself.
This should be exceedingly uncommon: its main use is testing open-source contributions before merge.

## PackagelintRuleEntry, PackagelintRuleConfig

```typescript
type PackagelintRuleEntry =
  /** A string: enable the rule, with default options */
  | PackagelintRuleName
  /** String & boolean: enable or disable the rule */
  | [PackagelintRuleName, boolean]
  /** String & string: enable the rule at the given errorLevel */
  | [PackagelintRuleName, 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore']
  /** String & object: enable the rule with the given options */
  | [PackagelintRuleName, OptionsType]
  /** Object: a full PackagelintRuleConfig, see below */
  | PackagelintRuleConfig;

// Each PackagelintRuleEntry is expanded into a PackagelintRuleConfig

interface PackagelintRuleConfig {
  /** The rule's unique identifier. If this matches an existing Rule then it will apply these settings to that rule.
   * If it is a new name then `extendRule` must be specified. */
  name: PackagelintRuleName;
  /** Whether or not to run the rule during validation */
  enabled: boolean;
  /** When making a new rule based off of an existing one, to give it different options or a different errorLevel,
   *  its implementation and default options will be copied from the base rule name.
   *  `name` must be a new, unrecognized value to do this. */
  extendRule?: PackagelintRuleName;
  /** If the rule fails, the errorLevel that its failure is reported as */
  errorLevel: 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore';
  /** Rule-specific options */
  options: OptionsType;
  /** When making a new copy of a rule via `extendRule`, this controls whether the base rule's current options are
   *  used, or whether its original defaultOptions are used. */
  resetOptions?: boolean;
}
```

### How to use it

Whether you're configuring Packagelint for your own project, or defining a RuleSet or RuleCombo for others,
RuleEntries are the main building block for what you'd like to actually run.

All rules are ultimately represented by the RuleConfig -- the different RuleEntry options are just syntactic sugar.

## PackagelintPreparedConfig

```typescript
/**
 * After all rule entries have been loaded, rulesets expanded and flattened, configs merged, reporters initialized,
 * and self-checks completed, the original UserConfig becomes a PreparedConfig.
 * This is what drives the validation step.
 */
interface PackagelintPreparedConfig {
  // Values from the UserConfig
  failOnErrorLevel: 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore';
  rulesConfig: PackagelintUserConfig['rules'];
  reportersConfig: PackagelintUserConfig['reporters'];
  aliasesConfig: PackagelintUserConfig['aliases'];
  reporterAliasesConfig: PackagelintUserConfig['reporterAliases'];

  // Results of preparation
  preparedRules: Array<PackagelintPreparedRule>;
  reporterInstances: Array<PackagelintReporterInstance>;

  // Internals
  _RulePreparer: PackagelintRulePreparerConstructor;
  _rulePreparerInstance: PackagelintRulePreparerInstance;
  _RuleValidator: PackagelintRuleValidatorConstructor;
  _ruleValidatorInstance: PackagelintRuleValidatorInstance;
}
```

### How to use it

You don't. This is internal to Packagelint itself.

You will only see this if you're a library author creating your own Packagelint reporter, rules, or internals.

## PackagelintPreparedRule

```typescript
interface PackagelintPreparedRule {
  preparedRuleName: PackagelintRuleName;
  docs: {
    description: string;
    [key: string]: string;
  };
  enabled: boolean;
  extendedFrom: PackagelintRuleName | null; // from extendRule
  fromRuleSet: PackagelintRuleSetName | null;
  fromRuleCombo: PackagelintRuleSetName | null;
  defaultErrorLevel: PackagelintErrorLevel;
  errorLevel: ErrorLevel; // from errorLevel + defaultErrorLevel
  defaultOptions: OptionsType;
  options: OptionsType; // from options + defaultOptions, mediated by resetOptions
  messages: Record<string, string>;
  doValidation: (
    options,
    packagelintContext,
  ) => PackagelintValidationResult | Promise<PackagelintValidationResult>;
}
```

### How to use it

You don't. This too is internal to Packagelint itself.

You will only see this if you're a library author creating your own Packagelint reporter, rules, or internals.
