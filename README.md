# Packagelint

[![build status](https://github.com/spautz/packagelint/workflows/CI/badge.svg)](https://github.com/spautz/packagelint/actions)
[![test coverage](https://img.shields.io/coveralls/github/spautz/packagelint/main.svg)](https://coveralls.io/github/spautz/packagelint?branch=main)

Packagelint is a linter for the files that live _around_ your code. It's meant to complement traditional code linters
like ESLint.

Packagelint runs a series of validation rules -- defined in `.packagelint.js` -- against your project directory.
It's most useful when you have a group of projects that should all follow common standards.

Some things you can do with it _(once published)_

- Enforce `.nvmrc` and a specific version of NodeJS
- Require specific NPM registry settings (e.g. to prevent [Dependency Confusion](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610))
- Suggest particular config values for ESLint, Jest, or other tools
- Require a minimum version of React, or some other dependency

## STILL IN DEVELOPMENT

This tool is not yet ready for public use. Version `0.1.0` will be the first public release. Full docs will be available
after `0.2.0`.

## At a Glance

- `.packagelint.js` sets options and errorLevels for the rules you want to run
- You can configure multiple copies of a rule. For example, the `nvmrc` rule can be run once to require a `.nvmrc`
  file with NodeJS `>=12`, at errorLevel "error"; and again with NodeJS `^16` at errorLevel "suggestion"
- Reporters and exit code conditions may be customized to be strict or lenient

It's like a hybrid between ESLint and Jest: rules are configured as if they're for a linter, but they're evaluated
and reported as if they're automated tests.

## Packages

### [@packagelint/packagelint](./packages/packagelint/)

[![npm version](https://img.shields.io/npm/v/@packagelint/packagelint.svg)](https://www.npmjs.com/package/@packagelint/packagelint)
[![test coverage](https://coveralls.io/repos/github/spautz/packagelint/badge.svg?branch=x-cov-packagelint)](https://coveralls.io/github/spautz/packagelint?branch=x-cov-packagelint)
[![dependencies status](https://img.shields.io/librariesio/release/npm/@packagelint/packagelint.svg)](https://libraries.io/github/spautz/packagelint)

The `packagelint` runtime, available as a CLI tool or as an importable API

### [@packagelint/core](./packages/core/)

[![npm version](https://img.shields.io/npm/v/@packagelint/core.svg)](https://www.npmjs.com/package/@packagelint/core)
[![test coverage](https://coveralls.io/repos/github/spautz/packagelint/badge.svg?branch=x-cov-core)](https://coveralls.io/github/spautz/packagelint?branch=x-cov-core)
[![dependencies status](https://img.shields.io/librariesio/release/npm/@packagelint/core.svg)](https://libraries.io/github/spautz/packagelint)

A collection of configurable rules, covering various standards and tools

### [@packagelint/presets](./packages/presets/)

[![npm version](https://img.shields.io/npm/v/@packagelint/presets.svg)](https://www.npmjs.com/package/@packagelint/presets)
[![dependencies status](https://img.shields.io/librariesio/release/npm/@packagelint/presets.svg)](https://libraries.io/github/spautz/packagelint)

A collection of validation presets: ready-to-use rulesets for common scenarios

### [@packagelint/packagelint-cli](./packages/packagelint-cli/)

[![npm version](https://img.shields.io/npm/v/@packagelint/packagelint-cli.svg)](https://www.npmjs.com/package/@packagelint/packagelint-cli)
[![dependencies status](https://img.shields.io/librariesio/release/npm/@packagelint/packagelint-cli.svg)](https://libraries.io/github/spautz/packagelint)

Run your local Packagelint via a global command

### [@packagelint/types](./packages/types/)

[![npm version](https://img.shields.io/npm/v/@packagelint/types.svg)](https://www.npmjs.com/package/@packagelint/types)
[![test coverage](https://coveralls.io/repos/github/spautz/packagelint/badge.svg?branch=x-cov-types)](https://coveralls.io/github/spautz/packagelint?branch=x-cov-types)
[![dependencies status](https://img.shields.io/librariesio/release/npm/@packagelint/types.svg)](https://libraries.io/github/spautz/packagelint)

Types, utilities, and validators for Packagelint internals

## Documentation _(pending/incomplete)_

- [Overview](./docs/index.md)
- [Typings](./packages/types/docs/index.md)

## Roadmap and Status

- [x] Proof of concept
- [x] Project scaffolding and CLI setup
- [x] Core functionality: Rule preparation
- [x] Core functionality: Validation
- [x] Core functionality: Reporting
- [ ] Initial rules
- [ ] Initial rulesets and combos
- [ ] Docs in repo (in progress)
- [ ] Docs online
- [ ] Test coverage
- [ ] Examples
- [x] Rule entry shorthands
- [ ] Full RuleCheck support (in progress)
- [ ] Full RuleSet support
- [ ] Full RuleCombo support
- [ ] Support for Jest reporters
- [x] Configs and patching
- [ ] Rule/reporter import aliases
