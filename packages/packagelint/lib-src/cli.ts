import {
  PackagelintException_Import,
  PackagelintException_Internal,
  PackagelintException_Reporter,
  PackagelintException_RuleDefinition,
  PackagelintException_UserConfig,
  PackagelintOutput,
  PackagelintUserConfig,
  resolveImportedValue,
} from '@packagelint/types';

import {
  EXIT__UNKNOWN,
  EXIT__INTERNAL_ERROR,
  EXIT__NO_CONFIG,
  EXIT__INVALID_CONFIG,
  EXIT__INVALID_REPORTER,
  EXIT__INVALID_RULE,
  PackagelintExitCode,
  findPackagelintConfigFile,
  runPackagelint,
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
): Promise<[PackagelintExitCode, PackagelintOutput | null, Error?]> {
  // const cliArgs = { ...DEFAULT_CLI_ARGS, ...argv };

  try {
    const packagelintConfigFileName = await findPackagelintConfigFile();

    if (!packagelintConfigFileName) {
      return [EXIT__NO_CONFIG, null];
    }

    const userConfig = await resolveImportedValue<PackagelintUserConfig>(
      require(packagelintConfigFileName),
    );
    if (!userConfig) {
      return [EXIT__INVALID_CONFIG, null];
    }

    const validationOutput = await runPackagelint(userConfig);

    console.warn('RETURN exitCode: ', validationOutput);
    return [validationOutput.exitCode as PackagelintExitCode, validationOutput];
  } catch (e: unknown) {
    let exitCode: PackagelintExitCode = EXIT__UNKNOWN;
    if (e instanceof PackagelintException_UserConfig || e instanceof PackagelintException_Import) {
      exitCode = EXIT__INVALID_CONFIG;
    } else if (e instanceof PackagelintException_Reporter) {
      exitCode = EXIT__INVALID_REPORTER;
    } else if (e instanceof PackagelintException_RuleDefinition) {
      exitCode = EXIT__INVALID_RULE;
    } else if (e instanceof PackagelintException_Internal) {
      exitCode = EXIT__INTERNAL_ERROR;
    }

    const error = e instanceof Error ? e : new Error('Unknown error: ' + JSON.stringify(e));

    return [exitCode, null, error];
  }
}

export { DEFAULT_CLI_ARGS, packagelintCli, findPackagelintConfigFile };
