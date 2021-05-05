import findUp from 'find-up';

import { PackagelintOutput } from '@packagelint/types';

import { prepareConfig } from './prepare';
import { FAILURE__NO_CONFIG, PackagelintExitCode } from './util';
import { doValidation } from './validate';

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
  _argv: Partial<PackagelintCliArgs> = {},
): Promise<[PackagelintExitCode, PackagelintOutput | null]> {
  // const cliArgs = { ...DEFAULT_CLI_ARGS, ...argv };

  const packagelintConfigFileName = await findPackagelintConfigFile();

  if (!packagelintConfigFileName) {
    return [FAILURE__NO_CONFIG, null];
  }

  const packagelintUserConfig = require(packagelintConfigFileName);

  const preparedConfig = await prepareConfig(packagelintUserConfig);

  const validationOutput = await doValidation(preparedConfig);

  return [validationOutput.exitCode as PackagelintExitCode, validationOutput];
}

export { DEFAULT_CLI_ARGS, packagelintCli, findPackagelintConfigFile };
