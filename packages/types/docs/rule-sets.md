# Packagelint Types: RuleSets

## Overview

A RuleSet is just a list of further RuleEntries -- much like the one the UserConfig provides. It can be generated
on-the-fly from the options, if needed, and RuleSets can contain other RuleSets. Similarly to RuleCheckDefinitions,
each RuleSet is implemented via a **RuleSetDefinition**.

RuleSets are evaluated before validation begins: they ultimately resolve into RuleChecks, there is not a separate
RuleCheckResult for them.
