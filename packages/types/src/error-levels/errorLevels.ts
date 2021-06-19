import { PackagelintErrorLevel } from './types';

const ERROR_LEVEL__EXCEPTION = 'exception' as const;
const ERROR_LEVEL__ERROR = 'error' as const;
const ERROR_LEVEL__WARNING = 'warning' as const;
const ERROR_LEVEL__SUGGESTION = 'suggestion' as const;
const ERROR_LEVEL__IGNORE = 'ignore' as const;

const ALL_ERROR_LEVELS = {
  EXCEPTION: ERROR_LEVEL__EXCEPTION,
  ERROR: ERROR_LEVEL__ERROR,
  WARNING: ERROR_LEVEL__WARNING,
  SUGGESTION: ERROR_LEVEL__SUGGESTION,
  IGNORE: ERROR_LEVEL__IGNORE,
};

const ERROR_LEVELS_IN_SEVERITY_ORDER: Array<PackagelintErrorLevel> = [
  ERROR_LEVEL__EXCEPTION,
  ERROR_LEVEL__ERROR,
  ERROR_LEVEL__WARNING,
  ERROR_LEVEL__SUGGESTION,
  ERROR_LEVEL__IGNORE,
];

function isValidErrorLevel(errorLevel: unknown): errorLevel is PackagelintErrorLevel {
  return ERROR_LEVELS_IN_SEVERITY_ORDER.includes(errorLevel as PackagelintErrorLevel);
}

function isErrorMoreSevereThan(
  errorLevel1: PackagelintErrorLevel,
  errorLevel2: PackagelintErrorLevel,
): boolean {
  if (!isValidErrorLevel(errorLevel1)) {
    throw new Error(`Invalid errorLevel: "${errorLevel1}"`);
  }
  if (!isValidErrorLevel(errorLevel2)) {
    throw new Error(`Invalid errorLevel: "${errorLevel2}"`);
  }

  const errorLevel1Severity = ERROR_LEVELS_IN_SEVERITY_ORDER.indexOf(errorLevel1);
  const errorLevel2Severity = ERROR_LEVELS_IN_SEVERITY_ORDER.indexOf(errorLevel2);
  return errorLevel1Severity < errorLevel2Severity;
}

function isErrorLessSevereThan(
  errorLevel1: PackagelintErrorLevel,
  errorLevel2: PackagelintErrorLevel,
): boolean {
  return !isErrorMoreSevereThan(errorLevel1, errorLevel2) && errorLevel1 !== errorLevel2;
}

export {
  ERROR_LEVEL__EXCEPTION,
  ERROR_LEVEL__ERROR,
  ERROR_LEVEL__WARNING,
  ERROR_LEVEL__SUGGESTION,
  ERROR_LEVEL__IGNORE,
  ALL_ERROR_LEVELS,
  ERROR_LEVELS_IN_SEVERITY_ORDER as ALL_ERROR_LEVEL_VALUES,
  ERROR_LEVELS_IN_SEVERITY_ORDER,
  isValidErrorLevel,
  isErrorLessSevereThan,
  isErrorMoreSevereThan,
};
