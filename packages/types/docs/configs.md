# Packagelint Types: Configs

## Overview

The `.packagelint.js` file supplies the **UserConfig**. This lists the rules and rulesets that will be checked --
each as a **RuleEntry** -- along with any options or overrides for them, and any global options for Packagelint
itself. This file should live next to each `package.json` you want to check.

The UserConfig is the entry point: no rules are run unless they're enabled here.

The rules and rulesets in the UserConfig are resolved, expanded, and ultimately flattened into a list of ready-to-run
validations: the **PreparedConfig**. Because a rule's configuration may be overridden later, no rules are evaluated
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
  /** Rules can supply error messages in multiple languages: this changes the preferred language */
  language: string;

  // Uncommon options
  /** A set of module names, module+rule names, or regular expressions which restricts which modules and rules are
   * allowed. Useful to restrict Packagelint to only use rules from certain sources */
  moduleAllowList: Array<string | RegExp>;
  /** A set of module names, module+rule names, or regular expressions for prohibiting certain modules and rules,
   * even if moduleAllowList would allow them. Useful to restrict Packagelint to only use rules from certain sources */
  moduleDenyList: Array<string | RegExp>;
  /** If something tries to resolve a module, rule, or ruleset which moduleAllowList does not permit, it will be
   * treated as this errorLevel. Defaults to 'exception' */
  moduleAllowListErrorLevel: 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore';
  /** If something tries to resolve a module, rule, or ruleset which moduleDenyList prohibits, it will be
   * treated as this errorLevel. Defaults to 'exception' */
  moduleDenyListErrorLevel: 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore';
  /** Maps a module or rule name to another. Useful for replacing a rule's implementation */
  ruleAliases: Record<string, string>;
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

The allowList and denyList can be used to add extra security and protect against some supply chain attacks. If you
want to prohibit any 3rd party rules and only allow those from Packagelint and your own internal packages, for
example, you could set `moduleAllowList: ['@packagelint/*', '@mycompany/*']`. You can even prohibit Packagelint's
own core rules in this way, if you'd like.

The aliases can be used to hotfix and replace one module with another -- if you fork `@packagelint/core` or another
module that provides rules or reporters, for example, you can create an alias so that rules/reporters imported from
`@packagelint/core` will instead be imported from the new package name.

If you need to rewrite, replace, or extend the Packagelint internals, you can inject your own implementations via
`_RulePreparer` and `_RuleValidator`. This is an easier alternative to forking `@packagelint/packagelint` itself.
This is uncommon: its main use is testing open-source contributions before merge.

## PackagelintRuleEntry, PackagelintRuleConfig

```typescript
type PackagelintRuleEntry =
  /** A string: enable the rule */
  | PackagelintRuleName
  /** String & boolean: enable or disable the rule */
  | [PackagelintRuleName, boolean]
  /** String & string: enable the rule at the given errorLevel */
  | [PackagelintRuleName, 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore']
  /** String & object: enable the rule with the given options */
  | [PackagelintRuleName, OptionsType]
  /** Object: a full PackagelintRuleConfig, see below */
  | PackagelintRuleConfig<OptionsType>;

// Each PackagelintRuleEntry is expanded into a PackagelintRuleConfig

interface PackagelintRuleConfig {
  /** The rule's unique identifier. If this matches an existing Rule then it will merge these settings over its
   * current or default config. If it is a new, unrecognized name then `extendRule` must be specified. */
  name: string;
  /** Whether or not to run the rule during validation */
  enabled: boolean;
  /** Used when making a new rule name which extends from an existing one, to give it its own options or a different
   * errorLevel. Its implementation and default options will be copied from the base rule name.
   * `name` must be a new, unrecognized value to do this. */
  extendRule?: string;
  /** If the rule fails, the errorLevel that its failure is reported as */
  errorLevel: 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore';
  /** Rule-specific options */
  options: OptionsType;
  /** When making a new copy of a rule via `extendRule`, this controls whether the base rule's current options are
   *  used, or whether its original defaultOptions are used. */
  resetOptions?: boolean;
  /** Override or expand error messages, e.g. for different languages */
  validationMessages: {
    [language: string]: {
      [key: string]: string;
    };
  };
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
  originalUserConfig: PackagelintUserConfig;
  failOnErrorLevel: 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore';
  originalRules: PackagelintUserConfig['rules'];
  originalReporters: PackagelintUserConfig['reporters'];

  moduleAllowList: PackagelintUserConfig['moduleAllowList'];
  moduleDenyList: PackagelintUserConfig['moduleDenyList'];
  moduleAllowListErrorLevel: PackagelintUserConfig['moduleAllowListErrorLevel'];
  moduleDenyListErrorLevel: PackagelintUserConfig['moduleDenyListErrorLevel'];
  ruleAliases: PackagelintUserConfig['ruleAliases'];
  reporterAliases: PackagelintUserConfig['reporterAliases'];

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

This is internal to Packagelint.

## PackagelintPreparedRule

```typescript
/**
 * After a rule entry has been processed, it results in one or more RuleChecks. Each RuleCheck, when fully resolved
 * and merged, becomes its own PreparedRule.
 */
interface PackagelintPreparedRule {
  name: string;
  enabled: boolean;
  docs: {
    url: string;
    [key: string]: string;
  };
  extendedFrom: string | null; // from extendRule
  originalRuleEntries: Array<PackagelintRuleEntry>;
  defaultErrorLevel: PackagelintErrorLevel;
  errorLevel: 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore'; // from errorLevel + defaultErrorLevel
  defaultOptions: OptionsType;
  options: OptionsType; // from options + defaultOptions, mediated by resetOptions

  doValidation: (
    options,
    packagelintContext,
  ) => PackagelintValidationResult | Promise<PackagelintValidationResult>;
  validationMessages: {
    [language: string]: {
      [key: string]: string;
    };
  };
}
```

### How to use it

This is internal to Packagelint.
