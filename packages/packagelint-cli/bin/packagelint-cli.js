#!/usr/bin/env node
/* eslint-env node */

const importLocal = require('import-local');

// import-local expects this file to be named `packagelint.js`, but `packagelint-cli.js` is a slightly nicer name
// when searching files in the repo. We need to switch back to the original name when searching.
const filenameWithOriginalBinName = __filename.replace(/packagelint-cli\.js$/, 'packagelint.js');

if (!importLocal(filenameWithOriginalBinName)) {
  console.error('Could not find local Packagelint. Please install it as a devDependency.');
  process.exitCode = 1;
}
