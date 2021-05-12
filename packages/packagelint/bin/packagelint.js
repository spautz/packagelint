#!/usr/bin/env node
/* eslint-env node */

require('v8-compile-cache');

const { FAILURE__UNKNOWN } = require('../lib-dist/api');

const onFatalError = (...args) => {
  console.error('Packagelint fatal error: ', ...args);
  process.exitCode = FAILURE__UNKNOWN;
};

(async function packagelint() {
  process.on('uncaughtException', onFatalError);
  process.on('unhandledRejection', onFatalError);

  const { packagelintCli } = require('../lib-dist/cli');
  try {
    const [exitCode /*, validationOutput */] = await packagelintCli(process.argv);
    process.exitCode = exitCode;
  } catch (e) {
    onFatalError(e.message, e);
  }
})().catch(onFatalError);
