# Packagelint Types: RuleChecks

## Overview

A RuleCheck is a 'normal' validation: it's what actually runs and checks the package for some condition.
All RuleEntries eventually becomes one or more RuleChecks.

The options from the UserConfig -- both Packagelint options like `enabled` and `errorLevel` and any rule-specific
options -- are combined with the **RuleCheckDefinition** that implements it. When evaluated it returns a
**RuleCheckResult** for later use.

## PackagelintRuleCheckDefinition

```typescript
interface PackagelintRuleCheckDefinition {
  /* Unique identifier for the rule */
  name: PackagelintRuleName;
  /* Human-readable information about the rule */
  docs: {
    description: string;
    [key: string]: string;
  };
  /* Whether the rule may be used directly, or whether it must first be extended to define a different rule. This is
   * used for generic rules that need to be invoked multiple times with different options, like `file-exists` */
  isAbstract: boolean;
  /* Error level for the rule, if not overridden by the user config or a ruleset. Defaults to "error". */
  defaultErrorLevel: 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore';
  /* Options for the rule, if not overridden by its rule entry */
  defaultOptions: OptionsType;
  /* Human-readable messages for failed validate results */
  messages: Record<string, string>;
  /* Function that implements the rule's checks */
  doValidation: (options, packagelintContext) => PackagelintRuleCheckResult | null;
}
```

### How to use it

If you're authoring your own rules, as a library author, then this is what you export for each.

When enabled, this is merged with the RuleConfig to become a PreparedRule, which can then be evaluated.

## PackagelintRuleCheckResult

```typescript
type PackagelintRuleCheckResult = {
  preparedRule: PackagelintPreparedRule;
  errorName: string | null;
  errorData: ErrorDataType | null;
};
```

### How to use it

If you're authoring your own reporter, as a library author, then this is what you will receive for each rule,
after validation.
