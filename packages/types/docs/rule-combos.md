# Packagelint Types: RuleCombos

## Overview

A RuleCombo also lists further RuleEntries, but instead of expanding them before validation, it can combine or
reinterpret their results after validation. RuleCombos are generally used to apply boolean logic to the results:
allowing success if either of two rules passes, or requiring a particular rule to fail, for example.

Similarly to RuleCheckDefinitions and RuleSetDefinitions, each RuleCombo is implemented via a **RuleComboDefinition**.
