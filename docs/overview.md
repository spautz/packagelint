# Overview: How Packagelint Works

Packagelint is a linter for the files that live _around_ your code. It's meant to complement traditional code linters
like ESLint.

Packagelint runs a series of validation rules -- defined in `.packagelint.js` -- against your project directory.
It's most useful when you have a group of projects that should all follow common standards, like having a `.npmrc`
file, certain `.npmrc` settings, particular config values for ESLint or Jest, or a certain version of React.

## At a Glance

- `.packagelint.js` enables and sets options for the rules you want to run.
- You can override options and errorLevel for an already-enabled rule at any time.
- You can create multiple copies of a rule by customizing its name: e.g., the `nvmrc` rule can be configured once
  to require a `.nvmrc` file with NodeJS >= 10, at errorLevel "error"; and again with NodeJS >= 14 at errorLevel "suggestion".
- Packagelint processes your config twice: the first pass resolves rules, expands rulesets, and flattens your options. The
  second pass evaluates each rule.
- Outputs and exit code conditions may be customized to be strict or lenient.

## Rule Definition vs Rule Config

(Docs in progress)
