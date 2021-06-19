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
      'isErrorLessSevereThan',
      'isErrorMoreSevereThan',
      'isValidErrorLevel',
      // ErrorLevelCounts
      'getHighestErrorLevel',
      'defaultErrorLevelCounts',
      // Exceptions
      'PackagelintUserConfigException',
      'PackagelintImportException',
      'PackagelintReporterException',
      'PackagelintRuleDefinitionException',
      'PackagelintInternalException',
    ];

    expect(allExportNames.sort()).toEqual(expectedExports.sort());
  });
});
