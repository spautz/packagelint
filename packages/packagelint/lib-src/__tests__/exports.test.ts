import * as allNamedExports from '../api';

describe('cli', () => {
  it('exports all known exports', () => {
    const allExportNames = Object.keys(allNamedExports).sort();
    const expectedExports = [
      // High-level API
      'findPackagelintConfigFile',
      // Constants and utils
      'ERROR_LEVEL__EXCEPTION',
      'ERROR_LEVEL__ERROR',
      'ERROR_LEVEL__WARNING',
      'ERROR_LEVEL__SUGGESTION',
      'ERROR_LEVEL__IGNORE',
      'ALL_ERROR_LEVELS',
      'ALL_ERROR_LEVEL_VALUES',
      'ERROR_LEVELS_IN_SEVERITY_ORDER',
      'countErrorTypes',
      'getHighestErrorLevel',
      'isErrorLessSevereThan',
      'isErrorMoreSevereThan',
      'isValidErrorLevel',
      'SUCCESS',
      'FAILURE__INVALID_CONFIG',
      'FAILURE__NO_CONFIG',
      'FAILURE__UNKNOWN',
      'FAILURE__VALIDATION',
      'ALL_EXIT_CODES',
      'ALL_EXIT_CODE_VALUES',
      'isValidExitCode',
      'isSuccessExitCode',
      'isFailureExitCode',
      'resolveRule',
      'resolveReporter',
      'constructClassOrFunction',
      'resolveImportedValue',
      // @TODO
      'defaultUserConfig',
      'prepareConfig',
      'accumulateRules',
      'RuleAccumulator',
      'isRuleDefinition',
      'isRulesetDefinition',
      'doValidation',
      'validatePreparedConfig',
      'validateRuleList',
      'validateOneRule',
      'makeValidationContext',
      'prepareReporters',
      'broadcastEvent',
      'broadcastEventUsingReporters',
    ].sort();

    expect(allExportNames).toEqual(expectedExports);
  });
});
