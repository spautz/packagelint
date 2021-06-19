import {
  ERROR_LEVEL__ERROR,
  ERROR_LEVEL__SUGGESTION,
  ALL_ERROR_LEVELS,
  ALL_ERROR_LEVEL_VALUES,
  ERROR_LEVELS_IN_SEVERITY_ORDER,
  isValidErrorLevel,
  countErrorTypes,
  getHighestErrorLevel,
  isErrorLessSevereThan,
  isErrorMoreSevereThan,
} from '../errorLevels';

describe('util/errorLevels', () => {
  describe('values', () => {
    it('exports all values', () => {
      const valuesFromArray = [...ALL_ERROR_LEVEL_VALUES].sort();
      const valuesFromObject = Object.keys(ALL_ERROR_LEVELS)
        .map((errorLevelName) => ALL_ERROR_LEVELS[errorLevelName as keyof typeof ALL_ERROR_LEVELS])
        .sort();
      const valuesFromOrderedArray = [...ERROR_LEVELS_IN_SEVERITY_ORDER].sort();

      expect(valuesFromArray).toEqual(valuesFromObject);
      expect(valuesFromArray).toEqual(valuesFromOrderedArray);
    });

    Object.keys(ALL_ERROR_LEVELS).forEach((errorLevelName) => {
      it(`recognizes error level ${errorLevelName}`, () => {
        const errorLevelValue = ALL_ERROR_LEVELS[errorLevelName as keyof typeof ALL_ERROR_LEVELS];
        expect(isValidErrorLevel(errorLevelValue)).toBe(true);
      });
    });

    it('rejects invalid error Level values', () => {
      expect(isValidErrorLevel('hello')).toBe(false);
    });

    it('rejects invalid error Level types', () => {
      expect(isValidErrorLevel(12345)).toBe(false);
      expect(isValidErrorLevel([])).toBe(false);
      expect(isValidErrorLevel(null)).toBe(false);
    });
  });

  describe('severity levels', () => {
    it('detects more-severe errors', () => {
      expect(isErrorMoreSevereThan(ERROR_LEVEL__ERROR, ERROR_LEVEL__SUGGESTION)).toBe(true);
      expect(isErrorMoreSevereThan(ERROR_LEVEL__SUGGESTION, ERROR_LEVEL__ERROR)).toBe(false);
    });

    it('detects less-severe errors', () => {
      expect(isErrorLessSevereThan(ERROR_LEVEL__ERROR, ERROR_LEVEL__SUGGESTION)).toBe(false);
      expect(isErrorLessSevereThan(ERROR_LEVEL__SUGGESTION, ERROR_LEVEL__ERROR)).toBe(true);
    });

    it('handles ties', () => {
      expect(isErrorMoreSevereThan(ERROR_LEVEL__ERROR, ERROR_LEVEL__ERROR)).toBe(false);
      expect(isErrorLessSevereThan(ERROR_LEVEL__SUGGESTION, ERROR_LEVEL__SUGGESTION)).toBe(false);
    });

    it('throws when asked to check bad values', () => {
      // @ts-expect-error
      expect(() => isErrorMoreSevereThan('hello', ERROR_LEVEL__ERROR)).toThrowError(
        'Invalid errorLevel: "hello"',
      );
      // @ts-expect-error
      expect(() => isErrorMoreSevereThan(ERROR_LEVEL__ERROR, 'world')).toThrowError(
        'Invalid errorLevel: "world"',
      );
      // @ts-expect-error
      expect(() => isErrorLessSevereThan('hello', ERROR_LEVEL__ERROR)).toThrowError(
        'Invalid errorLevel: "hello"',
      );
      // @ts-expect-error
      expect(() => isErrorLessSevereThan(ERROR_LEVEL__ERROR, 'world')).toThrowError(
        'Invalid errorLevel: "world"',
      );
    });

    describe('severity level totals', () => {
      it('detects most severe level from a set of counts', () => {
        expect(
          getHighestErrorLevel({
            exception: 0,
            error: 1,
            warning: 0,
            suggestion: 2,
            ignore: 3,
          }),
        ).toBe('error');

        expect(
          getHighestErrorLevel({
            exception: 0,
            error: 0,
            warning: 0,
            suggestion: 2,
            ignore: 3,
          }),
        ).toBe('suggestion');
      });

      it('resolves to "ignore" if there are no errors', () => {
        expect(
          getHighestErrorLevel({
            exception: 0,
            error: 0,
            warning: 0,
            suggestion: 0,
            ignore: 0,
          }),
        ).toBe('ignore');

        // @ts-expect-error
        expect(getHighestErrorLevel({})).toBe('ignore');
      });

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
  });
});
