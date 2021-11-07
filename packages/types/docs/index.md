# Packagelint Types: Overview

Types, utilities, and validators for Packagelint internals

This is not just a types package: it provides constants, enums, and validation utils for writing your own Packagelint
rules, rulesets, and other entities.

This file gives a brief overview of the main entities used in Packagelint.
See the neighboring files for more information on each.

## Configs

[Main doc: Configs](./configs.md)

The `.packagelint.js` file supplies the **UserConfig**. This lists the rules and rulesets that will be checked --
each as a **RuleEntry** -- along with any options or overrides for them, and any global options for Packagelint
itself. This file should live next to each `package.json` you want to check.

The UserConfig is the entry point: no rules are run unless they're enabled here.

The rules and rulesets in the UserConfig are resolved, expanded, and ultimately flattened into a list of ready-to-run
validations: the **PreparedConfig**. Because a rule's configuration may be overridden later, no rules are evaluated
until after all have been prepared.

## Rules

"Rule" is the generic, abstract term for something that will eventually become one or more validation checks.

The UserConfig lists the rules to run: each is a **RuleEntry**, which specifies a rule name and some options for it.
The rule name identifies the source of the rule: a rule name like `@packagelint/core:package-json` means
"import `@packagelint/core` and use the rule named `package-json`".

Each resolved RuleEntry is either a **RuleCheck**, a **RuleSet**, or a **RuleCombo**.

### RuleChecks

[Main doc: RuleChecks](./rule-checks.md)

A RuleCheck is a validation that runs and gives a result: it's what actually checks the package for some condition.
Every RuleSet and RuleCombo eventually becomes one or more RuleChecks.

The options from the UserConfig -- both Packagelint options like `enabled` and `errorLevel` and any rule-specific
options -- are combined with the **RuleCheckDefinition** that implements it. When evaluated it returns a
**RuleCheckResult** for later use.

### RuleSets

[Main doc: RuleSets](./rule-sets.md)

A RuleSet is a list of further RuleEntries -- much like the one the UserConfig provides. It can be static or dynamic
based on its options, and RuleSets can contain other RuleSets. Similarly to RuleCheckDefinitions, each RuleSet is
implemented via a **RuleSetDefinition**.

RuleSets are expanded before validation begins: they ultimately resolve into RuleChecks.

### RuleCombos

[Main doc: RuleCombos](./rule-combos.md)

A RuleCombo has a list of further RuleEntries, but instead of expanding them before validation, it can combine or
reinterpret their results after validation. RuleCombos are generally used to apply boolean logic to the results:
allowing success if either of two rules passes, or requiring a particular rule to fail, for example.

Similarly to RuleCheckDefinitions and RuleSetDefinitions, each RuleCombo is implemented via a **RuleComboDefinition**.

## Reporters

[Main doc: Reporters](./reporters.md)

Like unit test reporters, a Packagelint **Reporter** can output results to the console or to a file.

Packagelint supports Jest reporters out of the box, as well as Packagelint-specific reporters.

## Output

[Main doc: Output](./output.md)

After validation has finished, the final **Output** object summarizes the ultimate success or failure,
provides all of the individual results, and retains the UserConfig and PreparedConfig that led to them.

This is used to determine the exit code -- success or failure -- when running via CLI.
