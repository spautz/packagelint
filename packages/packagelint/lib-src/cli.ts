import findUp from 'find-up';

import { PackagelintOutput } from '@packagelint/core';

import { prepareConfig } from './prepare';
import { SUCCESS, FAILURE__NO_CONFIG, PackagelintExitCode, doValidation } from './validate';

export interface PackagelintCliArgs {
  // @TODO
}

const DEFAULT_CLI_ARGS: PackagelintCliArgs = {
  // @TODO
};

async function findPackagelintConfigFile(
  configFileName: string = '.packagelint.js',
  pathToSearchFrom: string = process.cwd(),
): Promise<string | undefined> {
  return findUp(configFileName, { cwd: pathToSearchFrom });
}

/**
 * 1. Read config
 * 2. Prepare list of rules for validation
 * 3. Perform validation
 * 4. Output results
 */
async function packagelintCli(
  argv: Partial<PackagelintCliArgs> = {},
): Promise<[PackagelintExitCode, PackagelintOutput | null]> {
  const cliArgs = { ...DEFAULT_CLI_ARGS, ...argv };
  console.log('cli args: ', argv, cliArgs);

  const packagelintConfigFileName = await findPackagelintConfigFile();
  console.log('packagelintConfigFileName = ', packagelintConfigFileName);

  if (!packagelintConfigFileName) {
    return [FAILURE__NO_CONFIG, null];
  }

  const packagelintUserConfig = require(packagelintConfigFileName);
  console.log('packagelintUserConfig = ', packagelintUserConfig);

  const preparedConfig = await prepareConfig(packagelintUserConfig);
  console.log('preparedConfig = ', preparedConfig);

  const validationOutput = await doValidation(preparedConfig);
  console.log('validationOutput = ', validationOutput);

  return [SUCCESS, validationOutput];
}

export { DEFAULT_CLI_ARGS, packagelintCli, findPackagelintConfigFile };
