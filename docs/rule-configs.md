# Rule Configs for Packagelint

This article walks through the different config objects that Packagelint consumes while validating rules.

## Inputs (Before Processing)

### User Config

The <code>.packagelint.js</code> file in the root of your package supplies your User Config. This lists the rules and
rulesets that will be validated against, along with any options or overrides for them, and any global options for
Packagelint itself.

The User Config is the entry point: no rules are enabled unless they're enabled here, either directly or via a Ruleset
that the Packagelint config enables.

```typescript
interface PackagelintUserConfig {
  /* Controls the exit code of `packagelint`: it will exit 1 if any rule fails at or above the specified level */
  failOnErrorLevel: 'exception' | 'error' | 'warn' | 'suggestion' | 'ignore';
  /* The rules and rulesets to run */
  rules: Array<PackagelintRuleConfig | PackagelintRulesetConfig>;
}
```

### Rule Definition

Each Rule Definition provides the implementation and any default options for one rule. The rule will not be enabled
unless the User Config contains a Rule Config for it (either directly or through a Ruleset Config).

This will generally come from an external package.

```typescript
interface PackagelintRuleDefinition {
  /* Unique identifier for the rule */
  name: string;
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
  extendRule?: string;
  /* Error level for the rule, if not overridden by the user config or a ruleset */
  defaultErrorLevel?: PackagelintErrorLevel;
  /* Options for the rule, if not overridden by the user config or a ruleset */
  defaultOptions: OptionsType;
  /* Human-readable messages for failed validation results */
  messages: Record<string, string>;
  /* Function that implements the rule's checks. Required unless extending another rule */
  doValidation: (
    options,
    packagelintContext,
  ) => PackagelintValidationResult | Promise<PackagelintValidationResult>;
}
```

### Rule Config

Configures a Rule Definition so that it may be run.

```typescript
/* Each rule must be identified by its name string. You can use shorthand or write it out in full */
type PackagelintRuleConfig =
  | name
  | [name, options]
  | {
      name: string;
      enabled?: boolean;
      extendRule?: string;
      errorLevel?: ErrorLevel;
      options?: OptionsType;
      messages?: Record<string, string>;
    };
```

### Ruleset Definition

A Ruleset groups other Rules and Rulesets together into a preset. This will generally come from an external package.

```typescript
interface PackagelintRulesetDefinition {
  name: string;
  globalOptions?: OptionsType;
  rules: Array<PackagelintRuleConfig | PackagelintRulesetConfig>;
}
```

### Ruleset Config

```typescript
/* Each ruleset must be identified by its name string. You can use shorthand or write it out in full */
type PackagelintRulesetConfig =
  | name
  | {
      name: string;
      enabled?: boolean;
      errorLevel?: ErrorLevel;
    };
```

## After Processing

The rules and rulesets in the User Config are expanded, flattened, and resolved, becoming a list of ready-to-run
validations:

```typescript
interface PackagelintProcessedConfig {
  failOnErrorLevel: 'exception' | 'error' | 'warn' | 'suggestion' | 'ignore';
  rules: Array<PackagelintProcessedRule>;
}

interface PackagelintProcessedRule {
  ruleName: string;
  docs: {
    description: string;
    [key: string]: string;
  };
  enabled: boolean;
  extendedFrom: string; // from extendRule
  errorLevel: ErrorLevel; // from errorLevel + defaultErrorLevel
  options: OptionsType; // from options + globalOptions + defaultOptions, mediated by resetOptions
  messages: Record<string, string>;
  doValidation: (
    options,
    packagelintContext,
  ) => PackagelintValidationResult | Promise<PackagelintValidationResult>;
}
```
