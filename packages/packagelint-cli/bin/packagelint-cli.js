#!/usr/bin/env node
/* eslint-env node */

const importLocal = require('import-local');

const filenameWithOriginalBinName = __filename.replace(/packagelint-cli\.js$/, 'packagelint.js');

console.log('filenameWithOriginalBinName = ', filenameWithOriginalBinName);

if (!importLocal(__filename)) {
  console.error('Could not find local Packagelint. Please install it as a devDependency.');
  process.exitCode = 1;
}
