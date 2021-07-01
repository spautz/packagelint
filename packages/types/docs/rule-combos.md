# Packagelint Types: RuleCombos

## Overview

A RuleCombo also lists further RuleEntries, but instead of expanding them before validation, it can combine or
reinterpret their results after validation. RuleCombos are generally used to apply boolean logic to the results:
allowing success if either of two rules passes, or requiring a particular rule to fail, for example.

Similarly to RuleCheckDefinitions and RuleSetDefinitions, each RuleCombo is implemented via a **RuleComboDefinition**.

## PackagelintRuleComboDefinition

```typescript
interface PackagelintRuleComboDefinition {
  /* Unique identifier for the rulecombo */
  name: PackagelintRuleName;
  /* Human-readable information about the rulecombo */
  docs: {
    description: string;
    [key: string]: string;
  };
  /* Options for the rulecombo, if not overridden by its rule entry */
  defaultOptions: OptionsType;
  /* The rules whose results the rulecombo will evaluate */
  ruleInputs:
    | Array<PackagelintRuleEntry>
    | Record<string, PackagelintRuleEntry>
    | ((options) => Array<PackagelintRuleEntry> | Record<string, PackagelintRuleEntry>);
  /* Function that implements the evaluation */
  doEvaluation: (options, ruleResults) => PackagelintRuleCheckResult | null;
}
```

### How to use it

If you're authoring your own rulecombos, as a library author, then this is what you export for each.

This registers the rules that will be run as part of the combo, as well as the function to evaluate their
PackagelintRuleCheckResults afterwards.
