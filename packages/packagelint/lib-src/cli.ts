import { PackagelintOutput } from '@packagelint/core';

import {
  FAILURE__INVALID_CONFIG,
  FAILURE__NO_CONFIG,
  PackagelintExitCode,
  doValidation,
  findPackagelintConfigFile,
  prepareConfig,
} from './api';

export interface PackagelintCliArgs {
  // @TODO
}

const DEFAULT_CLI_ARGS: PackagelintCliArgs = {
  // @TODO
};

/**
 * 1. Read config
 * 2. Process config into a list of rules for validation
 * 3. Perform validation
 * 4. Report results
 */
async function packagelintCli(
  _argv: Partial<PackagelintCliArgs> = {},
): Promise<[PackagelintExitCode, PackagelintOutput | null]> {
  // const cliArgs = { ...DEFAULT_CLI_ARGS, ...argv };

  const packagelintConfigFileName = await findPackagelintConfigFile();

  if (!packagelintConfigFileName) {
    return [FAILURE__NO_CONFIG, null];
  }

  const rawUserConfig = require(packagelintConfigFileName);
  if (!rawUserConfig) {
    return [FAILURE__INVALID_CONFIG, null];
  }
  const userConfig = await (typeof rawUserConfig === 'function' ? rawUserConfig() : rawUserConfig);

  const preparedConfig = await prepareConfig(userConfig);

  const validationOutput = await doValidation(preparedConfig);

  return [validationOutput.exitCode as PackagelintExitCode, validationOutput];
}

export { DEFAULT_CLI_ARGS, packagelintCli, findPackagelintConfigFile };
