#!/usr/bin/env node
/* eslint-env node */

require('v8-compile-cache');

const onFatalError = console.error;

(async function packagelint() {
  process.on('uncaughtException', onFatalError);
  process.on('unhandledRejection', onFatalError);

  const { packagelintCli } = require('../lib-dist/cli');
  const [exitCode /*, validationOutput */] = await packagelintCli(process.argv);
  process.exitCode = exitCode;
})().catch(onFatalError);
