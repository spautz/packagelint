import * as allNamedExports from '../api';

describe('cli', () => {
  it('exports all known exports', () => {
    const allExportNames = Object.keys(allNamedExports);
    const expectedExports = [
      // High-level API
      'findPackagelintConfigFile',
      // Preparation
      'prepareConfig',
      'prepareConfigRules',
      'DefaultRulePreparer',
      // Validation
      'validatePreparedConfig',
      'DefaultRuleValidator',
      // Import helpers
      'resolveRuleOrRuleset',
      'resolveReporter',
      'isFunction',
      'constructClassOrFunction',
      'resolveImportedValue',
      // Constants and utils
      'defaultUserConfig',
      'countErrorTypes',
      'EXIT__SUCCESS',
      'EXIT__UNKNOWN',
      'EXIT__VALIDATION_FAILED',
      'EXIT__INTERNAL_ERROR',
      'EXIT__NO_CONFIG',
      'EXIT__INVALID_CONFIG',
      'EXIT__INVALID_REPORTER',
      'EXIT__INVALID_RULE',
      'ALL_EXIT_CODES',
      'ALL_EXIT_CODE_VALUES',
      'isValidExitCode',
      'isSuccessExitCode',
      'isFailureExitCode',
      // @TODO
      'isRuleDefinition',
      'isRulesetDefinition',
      'prepareReporters',
      'broadcastEvent',
      'broadcastEventUsingReporters',
    ];

    expect(allExportNames.sort()).toEqual(expectedExports.sort());
  });
});
