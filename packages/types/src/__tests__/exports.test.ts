import * as allNamedExports from '..';

describe('cli', () => {
  it('exports all known exports', () => {
    const allExportNames = Object.keys(allNamedExports);
    const expectedExports = [
      // ErrorLevels
      'ALL_ERROR_LEVELS',
      'ALL_ERROR_LEVEL_VALUES',
      'ERROR_LEVEL__EXCEPTION',
      'ERROR_LEVEL__ERROR',
      'ERROR_LEVEL__WARNING',
      'ERROR_LEVEL__SUGGESTION',
      'ERROR_LEVEL__IGNORE',
      'ERROR_LEVELS_IN_SEVERITY_ORDER',
      'PACKAGELINT_REPORTER_EXPORTS_KEY',
      'PACKAGELINT_RULE_EXPORTS_KEY',
      'isErrorLessSevereThan',
      'isErrorMoreSevereThan',
      'isValidErrorLevel',
      // 3rd Party modules
      'checkPackagelintExports',
      'resolveImportedValue',
      // ErrorLevelCounts
      'getHighestErrorLevel',
      'defaultErrorLevelCounts',
      // Exceptions
      'PackagelintException_UserConfig',
      'PackagelintException_Import',
      'PackagelintException_Reporter',
      'PackagelintException_RuleDefinition',
      'PackagelintException_Internal',
      // Misc helpers
      'isFunction',
    ];

    expect(allExportNames.sort()).toEqual(expectedExports.sort());
  });
});
