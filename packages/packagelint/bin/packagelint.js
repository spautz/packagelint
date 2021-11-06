#!/usr/bin/env node
/* eslint-env node */

require('v8-compile-cache');

const { EXIT__UNKNOWN } = require('../lib-dist/api');

const onFatalError = (...args) => {
  console.error('Packagelint fatal error: ', ...args);
  process.exitCode = EXIT__UNKNOWN;
};

(async function packagelint() {
  process.on('uncaughtException', onFatalError);
  process.on('unhandledRejection', onFatalError);

  const { packagelintCli } = require('../lib-dist/cli');
  try {
    const [exitCode, validationOutput, error] = await packagelintCli(process.argv);

    console.log('packagelintCli() ', exitCode, validationOutput, error);

    process.exitCode = exitCode;
  } catch (e) {
    console.log('packagelintCli.exception: ', e);
    onFatalError(e.message, e);
  }
})().catch(onFatalError);
