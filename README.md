# Packagelint

[![build status](https://github.com/spautz/packagelint/workflows/CI/badge.svg)](https://github.com/spautz/packagelint/actions)
[![test coverage](https://img.shields.io/coveralls/github/spautz/packagelint/main.svg)](https://coveralls.io/github/spautz/packagelint?branch=main)

Packagelint is a linter for the files that live _around_ your code. It's meant to complement traditional code linters
like ESLint.

Packagelint runs a series of validation rules -- defined in `.packagelint.js` -- against your project directory.
It's most useful when you have a group of projects that should all follow common standards, like having a `.npmrc`
file, certain `.npmrc` settings, particular config values for ESLint or Jest, or a certain version of React.

## At a Glance

- `.packagelint.js` sets options and errorLevels for the rules you want to run.
- You can create multiple copies of a rule by customizing its name: e.g., the `nvmrc` rule can be configured once
  to require a `.nvmrc` file with NodeJS >= 10, at errorLevel "error"; and again with NodeJS >= 14 at errorLevel "suggestion".
- Reporters and exit code conditions may be customized to be strict or lenient.

## How it works

Under the hood, it's like a hybrid between ESLint and Jest: rules are configured as if they're for a linter, but
they're evaluated and reported as if they're automated tests.

## NOT YET PUBLISHED

This tool is not yet ready for public use. Version `0.1.0` will be the first public release. Full docs will be available
after `0.2.0`.

## Packages

#### [@packagelint/core](./packages/core/)

[![npm version](https://img.shields.io/npm/v/@packagelint/core.svg)](https://www.npmjs.com/package/@packagelint/core)
[![dependencies status](https://img.shields.io/david/spautz/packagelint.svg?path=packages/core)](https://david-dm.org/spautz/packagelint?path=packages/core)
[![gzip size](https://img.badgesize.io/https://unpkg.com/@packagelint/core@latest/dist/core.cjs.production.min.js?compression=gzip)](https://bundlephobia.com/result?p=@packagelint/core@latest)

A collection of validation checks, covering various standards and tools that you might want to check for.

#### [@packagelint/packagelint](./packages/packagelint/)

[![npm version](https://img.shields.io/npm/v/@packagelint/packagelint.svg)](https://www.npmjs.com/package/@packagelint/packagelint)
[![dependencies status](https://img.shields.io/david/spautz/packagelint.svg?path=packages/packagelint)](https://david-dm.org/spautz/packagelint?path=packages/packagelint)
[![gzip size](https://img.badgesize.io/https://unpkg.com/@packagelint/packagelint@latest/dist/packagelint.cjs.production.min.js?compression=gzip)](https://bundlephobia.com/result?p=@packagelint/packagelint@latest)

The `packagelint` command itself, available as a CLI tool or as an importable API.

#### [@packagelint/packagelint-cli](./packages/packagelint-cli/)

[![npm version](https://img.shields.io/npm/v/@packagelint/packagelint-cli.svg)](https://www.npmjs.com/package/@packagelint/packagelint-cli)
[![dependencies status](https://img.shields.io/david/spautz/packagelint.svg?path=packages/packagelint-cli)](https://david-dm.org/spautz/packagelint?path=packages/packagelint-cli)

Run your local Packagelint via a global command

#### [@packagelint/presets](./packages/presets/)

[![npm version](https://img.shields.io/npm/v/@packagelint/presets.svg)](https://www.npmjs.com/package/@packagelint/presets)
[![dependencies status](https://img.shields.io/david/spautz/packagelint.svg?path=packages/presets)](https://david-dm.org/spautz/packagelint?path=packages/presets)
[![gzip size](https://img.badgesize.io/https://unpkg.com/@packagelint/presets@latest/dist/presets.cjs.production.min.js?compression=gzip)](https://bundlephobia.com/result?p=@packagelint/presets@latest)

A collection of validation presets: a ready-to-use ruleset that selects and configures some of the core rules for
common scenarios.

## Documentation (incomplete)

- [Overview](./docs/README.md)
- [Config Typings](./docs/configs-and-typings.md)
