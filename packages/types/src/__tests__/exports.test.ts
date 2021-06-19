import * as allNamedExports from '..';

describe('cli', () => {
  it('exports all known exports', () => {
    const allExportNames = Object.keys(allNamedExports);
    const expectedExports = [
      // Errors
      'PackagelintUserConfigError',
      'PackagelintImportError',
      'PackagelintReporterError',
      'PackagelintRuleDefinitionError',
      'PackagelintInternalError',
    ];

    expect(allExportNames.sort()).toEqual(expectedExports.sort());
  });
});
