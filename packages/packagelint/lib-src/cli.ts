import {
  PackagelintException_Import,
  PackagelintException_Internal,
  PackagelintException_Reporter,
  PackagelintException_RuleDefinition,
  PackagelintException_UserConfig,
  PackagelintOutput,
  PackagelintUserConfig,
} from '@packagelint/types';

import {
  FAILURE__UNKNOWN,
  FAILURE__INTERNAL,
  FAILURE__NO_CONFIG,
  FAILURE__INVALID_CONFIG,
  FAILURE__INVALID_REPORTER,
  FAILURE__INVALID_RULE,
  PackagelintExitCode,
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
    if (e instanceof PackagelintException_UserConfig || e instanceof PackagelintException_Import) {
      exitCode = FAILURE__INVALID_CONFIG;
    } else if (e instanceof PackagelintException_Reporter) {
      exitCode = FAILURE__INVALID_REPORTER;
    } else if (e instanceof PackagelintException_RuleDefinition) {
      exitCode = FAILURE__INVALID_RULE;
    } else if (e instanceof PackagelintException_Internal) {
      exitCode = FAILURE__INTERNAL;
    }

    return [exitCode, e];
  }
}

export { DEFAULT_CLI_ARGS, packagelintCli, findPackagelintConfigFile };
