#!/usr/bin/env node
/* eslint-env node */

require('v8-compile-cache');

const onFatalError = console.error;

(async function packagelint() {
  process.on('uncaughtException', onFatalError);
  process.on('unhandledRejection', onFatalError);

  process.exitCode = await require('../lib-dist/cli').execute(process.argv);
})().catch(onFatalError);
