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
      'PackageLintRuleValidator_InternalValidateError',
      // Validation
      'validatePreparedConfig',
      'DefaultRuleValidator',
      'PackageLintRuleValidator_InternalPrepareError',
      // Import helpers
      'resolveRule',
      'resolveReporter',
      'isFunction',
      'constructClassOrFunction',
      'resolveImportedValue',
      // Constants and utils
      'defaultUserConfig',
      'PackageLintRuleValidator_ExternalModuleError',
      'PackageLintRuleValidator_ReporterConfigError',
      'PackageLintRuleValidator_RuleConfigError',
      'PackageLintRuleValidator_UserConfigError',
      'ALL_ERROR_LEVELS',
      'ALL_ERROR_LEVEL_VALUES',
      'ERROR_LEVEL__EXCEPTION',
      'ERROR_LEVEL__ERROR',
      'ERROR_LEVEL__WARNING',
      'ERROR_LEVEL__SUGGESTION',
      'ERROR_LEVEL__IGNORE',
      'ERROR_LEVELS_IN_SEVERITY_ORDER',
      'countErrorTypes',
      'getHighestErrorLevel',
      'isErrorLessSevereThan',
      'isErrorMoreSevereThan',
      'isValidErrorLevel',
      'SUCCESS',
      'FAILURE__UNKNOWN',
      'FAILURE__VALIDATION',
      'FAILURE__NO_CONFIG',
      'FAILURE__INVALID_CONFIG',
      'FAILURE__INVALID_PREPARE',
      'FAILURE__INVALID_VALIDATION',
      'ALL_EXIT_CODES',
      'ALL_EXIT_CODE_VALUES',
      'isValidExitCode',
      'isSuccessExitCode',
      'isFailureExitCode',
      // @TODO
      'accumulateRules',
      'RuleAccumulator',
      'isRuleDefinition',
      'isRulesetDefinition',
      'prepareReporters',
      'broadcastEvent',
      'broadcastEventUsingReporters',
    ];

    expect(allExportNames.sort()).toEqual(expectedExports.sort());
  });
});
