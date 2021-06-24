import {
  ALL_EXIT_CODE_VALUES,
  ALL_EXIT_CODES,
  EXIT__SUCCESS,
  EXIT__VALIDATION_FAILED,
  isFailureExitCode,
  isSuccessExitCode,
  isValidExitCode,
} from '../exitCodes';

describe('util/exitCodes', () => {
  it('exports all values', () => {
    const valuesFromArray = [...ALL_EXIT_CODE_VALUES].sort();
    const valuesFromObject = Object.keys(ALL_EXIT_CODES)
      .map((exitCodeName) => ALL_EXIT_CODES[exitCodeName as keyof typeof ALL_EXIT_CODES])
      .sort();

    expect(valuesFromArray).toEqual(valuesFromObject);
  });

  Object.keys(ALL_EXIT_CODES).forEach((exitCodeName) => {
    it(`recognizes exit code ${exitCodeName}`, () => {
      const exitCodeValue = ALL_EXIT_CODES[exitCodeName as keyof typeof ALL_EXIT_CODES];
      expect(isValidExitCode(exitCodeValue)).toBe(true);
    });
  });

  it(`recognizes success`, () => {
    expect(isValidExitCode(EXIT__SUCCESS)).toBe(true);
    expect(isSuccessExitCode(EXIT__SUCCESS)).toBe(true);
    expect(isFailureExitCode(EXIT__SUCCESS)).toBe(false);
  });

  it(`recognizes non-success`, () => {
    expect(isValidExitCode(EXIT__VALIDATION_FAILED)).toBe(true);
    expect(isSuccessExitCode(EXIT__VALIDATION_FAILED)).toBe(false);
    expect(isFailureExitCode(EXIT__VALIDATION_FAILED)).toBe(true);
  });

  it(`recognizes all exit code values`, () => {
    ALL_EXIT_CODE_VALUES.forEach((exitCodeValue) => {
      expect(isValidExitCode(exitCodeValue)).toBe(true);

      const shouldBeSuccess = exitCodeValue === EXIT__SUCCESS;
      expect(isSuccessExitCode(exitCodeValue)).toBe(shouldBeSuccess);
      expect(isFailureExitCode(exitCodeValue)).toBe(!shouldBeSuccess);
    });
  });

  it('rejects invalid exit code values', () => {
    expect(isValidExitCode(12345)).toBe(false);
    expect(isSuccessExitCode(12345)).toBe(false);
    expect(isFailureExitCode(12345)).toBe(false);
  });

  it('rejects invalid exit code types', () => {
    expect(isValidExitCode('hello')).toBe(false);
    expect(isSuccessExitCode([])).toBe(false);
    expect(isFailureExitCode(null)).toBe(false);
  });
});
