# Packagelint Types: RuleSets

## Overview

A RuleSet is just a list of further RuleEntries -- much like the one the UserConfig provides. It can be generated
on-the-fly from the options, if needed, and RuleSets can contain other RuleSets. Similarly to RuleCheckDefinitions,
each RuleSet is implemented via a **RuleSetDefinition**.

RuleSets are evaluated before validation begins: they ultimately resolve into RuleChecks, there is not a separate
RuleCheckResult for them.

## PackagelintRuleSetDefinition

```typescript
interface PackagelintRuleSetDefinition {
  /* Unique identifier for the ruleset */
  name: PackagelintRuleName;
  /* Human-readable information about the ruleset */
  docs: {
    description: string;
    [key: string]: string;
  };
  /* Options for the ruleset, if not overridden by its rule entry */
  defaultOptions: OptionsType;
  /* The rulechecks, rulesets, and rulecombos to run for this ruleset */
  rules: Array<PackagelintRuleEntry> | ((options) => Array<PackagelintRuleEntry>);
}
```

### How to use it

If you're authoring your own rulesets, as a library author, then this is what you export for each.

This lists the rules that will be run when the ruleset is enabled -- or it dynamically generates the list, if desired.
