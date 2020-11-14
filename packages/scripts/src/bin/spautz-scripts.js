#!/usr/bin/env node

const sade = require('sade');

const scriptsPackageJson = require('../../package.json');
const helloWorldCommand = require('../lib/commands/hello-world').default;

const prog = sade(scriptsPackageJson.binName);

prog.version(scriptsPackageJson.version);

prog.command('hello-world').describe('Says "Hello World!"').action(helloWorldCommand);

prog.parse(process.argv);
