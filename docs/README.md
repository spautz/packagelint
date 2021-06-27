# Packagelint: Overview

Packagelint is a linter for the files that live _around_ your code. It's meant to complement traditional code linters
like ESLint.

Packagelint runs a series of validation rules -- defined in `.packagelint.js` -- against your project directory.
It's most useful when you have a group of projects that should all follow common standards.

Some things you can do with it _(once published)_

- Enforce `.nvmrc` and a specific version of NodeJS
- Require specific NPM registry settings (e.g. to prevent [Dependency Confusion](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610))
- Suggest particular config values for ESLint, Jest, or other tools
- Require a minimum version of React, or some other dependency

## At a Glance

- `.packagelint.js` sets options and errorLevels for the rules you want to run
- You can configure multiple copies of a rule. For example, the `nvmrc` rule can be run once to require a `.nvmrc`
  file with NodeJS `>=12`, at errorLevel "error"; and again with NodeJS `^16` at errorLevel "suggestion"
- Reporters and exit code conditions may be customized to be strict or lenient

## How it works

Under the hood, it's like a hybrid between ESLint and Jest: rules are configured as if they're for a linter, but
they're evaluated and reported as if they're automated tests. Packagelint is designed to be fully extendable, both in
its rules and in its internal implementation.

- Everything starts with a UserConfig, usually from `.packagelint.js`. This config will be processed twice: the first
  pass resolves rules, expands rulesets, and applies options and overrides. The second pass evaluates each rule.
- Each rule entry in the UserConfig is either an override that enables or customizes an existing rule, or an extension
  to create a new rule based on the first. This is how the "multiple copies of a rule" note above works: a single
  base rule for validating `.nvmrc` can become multiple rules with different errorLevels and their own configs.
- Rules and rulesets are scoped by package: `@packagelint/core:nvmrc` indicates a rule named `nvmrc` which is exported
  from the `@packagelint/core` npm package.

## More Docs

(Docs in progress)

To do:

- Rule Entry = string/array/object, which expand to one of:
  - RuleCheck (RuleTest?) = the actual thing that runs
  - Ruleset (RuleGroup?) = a group of rules (fn of options?)
  - RuleCombo = boolean logic for combining, modifying, or reinterprets results
    @TODO: {
    ruleComboName: '@packagelint/core:andOperator'
    rules: Array<RuleEntry> or Record<string, RuleEntry>
    }
