import {
  ALL_ERROR_LEVEL_VALUES,
  ALL_ERROR_LEVELS,
  ERROR_LEVEL__ERROR,
  ERROR_LEVEL__SUGGESTION,
  ERROR_LEVELS_IN_SEVERITY_ORDER,
  isErrorLessSevereThan,
  isErrorMoreSevereThan,
  isValidErrorLevel,
} from '..';

describe('error-levels/errorLevels', () => {
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
      // @ts-expect-error Invalid errorLevel
      expect(() => isErrorMoreSevereThan('hello', ERROR_LEVEL__ERROR)).toThrowError(
        'Invalid errorLevel: "hello"',
      );
      // @ts-expect-error Invalid errorLevel
      expect(() => isErrorMoreSevereThan(ERROR_LEVEL__ERROR, 'world')).toThrowError(
        'Invalid errorLevel: "world"',
      );
      // @ts-expect-error Invalid errorLevel
      expect(() => isErrorLessSevereThan('hello', ERROR_LEVEL__ERROR)).toThrowError(
        'Invalid errorLevel: "hello"',
      );
      // @ts-expect-error Invalid errorLevel
      expect(() => isErrorLessSevereThan(ERROR_LEVEL__ERROR, 'world')).toThrowError(
        'Invalid errorLevel: "world"',
      );
    });
  });
});
