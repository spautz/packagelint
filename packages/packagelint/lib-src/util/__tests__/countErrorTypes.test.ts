import { countErrorTypes } from '..';

describe('util/countErrorTypes', () => {
  it('initializes defaults when counting errors', () => {
    const errorCounts = countErrorTypes([]);
    expect(errorCounts).toEqual({
      exception: 0,
      error: 0,
      warning: 0,
      suggestion: 0,
      ignore: 0,
    });
  });

  it('parses a single error result', () => {
    const errorCounts = countErrorTypes([
      {
        preparedRuleName: 'test:example',
        errorLevel: 'warning',
        errorName: 'someErrorType',
        errorData: {},
        message: 'Example error message',
      },
    ]);
    expect(errorCounts).toEqual({
      exception: 0,
      error: 0,
      warning: 1,
      suggestion: 0,
      ignore: 0,
    });
  });

  it('parses multiple validation results', () => {
    const errorCounts = countErrorTypes([
      null,
      {
        preparedRuleName: 'test:example1',
        errorLevel: 'warning',
        errorName: 'someErrorType',
        errorData: {},
        message: 'Example error message',
      },
      null,
      {
        preparedRuleName: 'test:example2',
        errorLevel: 'error',
        errorName: 'someErrorType',
        errorData: {},
        message: 'Example error message',
      },
      null,
      {
        preparedRuleName: 'test:example3',
        errorLevel: 'warning',
        errorName: 'someErrorType',
        errorData: {},
        message: 'Example error message',
      },
    ]);
    expect(errorCounts).toEqual({
      exception: 0,
      error: 1,
      warning: 2,
      suggestion: 0,
      ignore: 0,
    });
  });

  it('honors weird error levels if necessary', () => {
    const errorCounts = countErrorTypes([
      {
        preparedRuleName: 'test:example1',
        errorLevel: 'suggestion',
        errorName: 'someErrorType',
        errorData: {},
        message: 'Example error message',
      },
      null,
      {
        preparedRuleName: 'test:example2',
        // @ts-expect-error
        errorLevel: 'better_suggestion',
        errorName: 'someErrorType',
        errorData: {},
        message: 'Example error message',
      },
    ]);
    expect(errorCounts).toEqual({
      exception: 0,
      error: 0,
      warning: 0,
      suggestion: 1,
      ignore: 0,
      better_suggestion: 1,
    });
  });
});
