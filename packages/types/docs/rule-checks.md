# Packagelint Types: RuleChecks

## Overview

A RuleCheck is a validation that runs and gives a result: it's what actually checks the package for some condition.
Every RuleSet and RuleCombo eventually becomes one or more RuleChecks.

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
    url: string;
    [key: string]: string;
  };
  /* Whether the rule may be used directly, or whether it must first be extended to define a different rule. This is
   * used for generic rules that don't have a fixed semantic meaning and should instead be used by other rules
   * with different options, like `file-exists` or `boolean-and` */
  isAbstract: boolean;
  /* Error level for the rule, if not overridden by the user config or a ruleset. Defaults to "error". */
  defaultErrorLevel: 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore';
  /* Options for the rule, if not overridden by its rule entry */
  defaultOptions: OptionsType;
  /* Function that implements the rule's checks */
  doValidation: (options, packagelintContext) => PackagelintRuleCheckResult | null;
  /* Human-readable messages for failed validate results */
  validationMessages: {
    [language: string]: {
      [key: string]: string;
    };
  };
}
```

### How to use it

If you're defining brand new rules, as a library author, then this is what you export for each.

When enabled, this is merged with the RuleConfig to become a PreparedRule, which can then be evaluated.

## PackagelintRuleCheckResult

```typescript
type PackagelintRuleCheckResult = [errorName: string | null, errorData?: ErrorDataType] | null;
```

### How to use it

If you're implementing your own rule validation functions, as a library author, then this is what your `doValidation`
should return.

If the validation check passes, return `null` -- either overall or for the errorName.

If the validation check fails, it should provide an `errorName` which matches one of the keys in `validationMessages`.
