# Packagelint Types: RuleChecks

## Overview

A RuleCheck is a 'normal' validation: it's what actually runs and checks the package for some condition.
All RuleEntries eventually becomes one or more RuleChecks.

The options from the UserConfig -- both Packagelint options like `enabled` and `errorLevel` and any rule-specific
options -- are combined with the **RuleCheckDefinition** that implements it. When evaluated it returns a
**RuleCheckResult** for later use.
