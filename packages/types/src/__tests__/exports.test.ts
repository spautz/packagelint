import * as allNamedExports from '..';

describe('cli', () => {
  it('exports all known exports', () => {
    const allExportNames = Object.keys(allNamedExports);
    const expectedExports = [
      // Errors
      'PackagelintUserConfigException',
      'PackagelintImportException',
      'PackagelintReporterException',
      'PackagelintRuleDefinitionException',
      'PackagelintInternalException',
    ];

    expect(allExportNames.sort()).toEqual(expectedExports.sort());
  });
});
