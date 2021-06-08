import { PackagelintOutput, PackagelintUserConfig } from '@packagelint/core';

import {
  FAILURE__NO_CONFIG,
  FAILURE__INVALID_CONFIG,
  FAILURE__UNKNOWN,
  FAILURE__INVALID_PREPARE,
  FAILURE__INVALID_VALIDATION,
  PackagelintExitCode,
  PackageLintRuleValidator_InternalPrepareError,
  PackageLintRuleValidator_InternalValidateError,
  findPackagelintConfigFile,
  prepareConfig,
  resolveImportedValue,
  validatePreparedConfig,
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

  try {
    const packagelintConfigFileName = await findPackagelintConfigFile();

    if (!packagelintConfigFileName) {
      return [FAILURE__NO_CONFIG, null];
    }

    const userConfig = await resolveImportedValue<PackagelintUserConfig>(
      require(packagelintConfigFileName),
    );
    if (!userConfig) {
      return [FAILURE__INVALID_CONFIG, null];
    }

    const preparedConfig = await prepareConfig(userConfig);
    const validationOutput = await validatePreparedConfig(preparedConfig);

    console.warn('RETURN exitCode: ', validationOutput);
    return [validationOutput.exitCode as PackagelintExitCode, validationOutput];
  } catch (e) {
    let exitCode: PackagelintExitCode = FAILURE__UNKNOWN;
    if (e instanceof PackageLintRuleValidator_InternalPrepareError) {
      exitCode = FAILURE__INVALID_PREPARE;
    } else if (e instanceof PackageLintRuleValidator_InternalValidateError) {
      exitCode = FAILURE__INVALID_VALIDATION;
    }

    return [exitCode, e];
  }
}

export { DEFAULT_CLI_ARGS, packagelintCli, findPackagelintConfigFile };
