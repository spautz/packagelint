import {
  PackagelintPreparedRule,
  PackagelintUnknownErrorData,
  PackagelintValidationContext,
} from '@packagelint/types';

/**
 * Provides information and helper functions to make rules easier to write
 */
function makeValidationContext(
  preparedRule: PackagelintPreparedRule,
): PackagelintValidationContext {
  const { ruleName } = preparedRule;

  const accumulatedErrorData = {};

  function setErrorData(errorData: PackagelintUnknownErrorData): void {
    Object.assign(accumulatedErrorData, errorData);
  }

  return {
    // General information
    ruleName,

    // Helpers so that rules don't have to implement everything themselves
    findFileUp: (_fileGlob: string) => {
      throw new Error('Not implemented');
    },
    // Setting errorData and returning errors
    createErrorToReturn: (
      errorName: string,
      extraErrorData?: PackagelintUnknownErrorData,
    ): [string, PackagelintUnknownErrorData] => {
      if (extraErrorData) {
        setErrorData(extraErrorData);
      }
      return [errorName, accumulatedErrorData];
    },
    setErrorData,
  };
}

export { makeValidationContext };
