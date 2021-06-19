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
      'SUCCESS',
      'FAILURE__UNKNOWN',
      'FAILURE__VALIDATION',
      'FAILURE__INTERNAL',
      'FAILURE__NO_CONFIG',
      'FAILURE__INVALID_CONFIG',
      'FAILURE__INVALID_REPORTER',
      'FAILURE__INVALID_RULE',
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
