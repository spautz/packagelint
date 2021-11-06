#!/usr/bin/env node
/* eslint-env node */

const findUp = require('find-up');
const path = require('path');

(async () => {
  const localPackagelintModule = await findUp('node_modules/@packagelint/packagelint', {
    type: 'directory',
  });

  require(path.join(localPackagelintModule, 'bin/packagelint.js'));
})();
