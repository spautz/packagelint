# Packagelint Types: Overview

Types, utilities, and validators for Packagelint internals

This is not just a types package: it provides constants, enums, and validation utils for writing your own Packagelint
rules, reporters, and other internals.

This overview gives a brief synopsis of the main entities used in Packagelint.
See the neighboring files for more information on each.

## Configs

[Main doc: Configs](./configs.md)

The `.packagelint.js` file in the root of your package supplies the **UserConfig**. This lists the rules and rulesets that
will be validated against, along with any options or overrides for them, and any global options for Packagelint itself.

The UserConfig is the entry point: no rules are run unless they're enabled here.

The rules and rulesets in the UserConfig are expanded, flattened, and resolved, becoming a list of ready-to-run
validations: the **PreparedConfig**. Because a rule's configuration can be overridden later, no rules are evaluated
until after all have been prepared.

## Rules

[Main doc: Rules](./rules.md)

"Rule" is the generic, abstract term for something that will eventually become one or more validation checks.

The UserConfig lists the rules to run: each is a **RuleEntry**, which specifies a rule name and some options for it.
The rule name identifies the source of the rule: a rule name like `@packagelint/core:package-json` means
"import `@packagelint/core` and use the rule named `package-json`".

Once that's imported, it'll either be a **RuleCheck**, **RuleSet**, or **RuleCombo**.

### RuleChecks

A RuleCheck is a 'normal' validation: it's what actually runs and checks the package for some condition.
All RuleEntries eventually becomes one or more RuleChecks.

The options from the UserConfig -- both Packagelint options like `enabled` and `errorLevel` and any rule-specific
options -- are combined with the **RuleCheckDefinition** that implements it. When evaluated it returns a
**RuleCheckResult** for later use.

### RuleSets

A RuleSet is just a list of further RuleEntries -- much like the one the UserConfig provides. It can be generated
on-the-fly from the options, if needed, and RuleSets can contain other RuleSets. Similarly to RuleCheckDefinitions,
each RuleSet is implemented via a **RuleSetDefinition**.

RuleSets are evaluated before validation begins: they ultimately resolve into RuleChecks, there is not a separate
RuleCheckResult for them.

### RuleCombos

A RuleCombo also lists further RuleEntries, but instead of expanding them before validation, it can combine or
reinterpret their results after validation. RuleCombos are generally used to apply boolean logic to the results:
allowing success if either of two rules passes, or requiring a particular rule to fail, for example.

Similarly to RuleCheckDefinitions and RuleSetDefinitions, each RuleCombo is implemented via a **RuleComboDefinition**.

## Reporters

Like unit test reporters, a Packagelint **Reporter** can output results to the console or to a file.

## Output

After validation has finished, the final **Output** object summarizes the ultimate success or failure,
provides all of the individual results, and specifies and UserConfig and PreparedConfig that led to them.
