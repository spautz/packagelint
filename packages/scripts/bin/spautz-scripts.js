#!/usr/bin/env node

const sade = require('sade');

const scriptsPackageJson = require('../package.json');
const { buildCommand, helloWorldCommand } = require('../dist/commands');

const prog = sade(scriptsPackageJson.binName);

prog.version(scriptsPackageJson.version);

prog.command('build').describe('Run TSDX build').action(buildCommand);
prog.command('hello-world').describe('Say "Hello World!"').action(helloWorldCommand);

prog.parse(process.argv);
