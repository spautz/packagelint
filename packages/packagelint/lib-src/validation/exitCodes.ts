export const SUCCESS = 0 as const;
export const FAILURE__UNKNOWN = -1;
export const FAILURE__NO_CONFIG = 1 as const;
export const FAILURE__INVALID_CONFIG = 2 as const;
export const FAILURE__VALIDATION = 3 as const;

export type EXIT_CODE = typeof ALL_EXIT_CODE_VALUES[number];

const ALL_EXIT_CODES = {
  SUCCESS,
  FAILURE__UNKNOWN,
  FAILURE__NO_CONFIG,
  FAILURE__INVALID_CONFIG,
  FAILURE__VALIDATION,
};

const ALL_EXIT_CODE_VALUES = Object.values(ALL_EXIT_CODES);

function isValidExitCode(exitCode: number): boolean {
  return ALL_EXIT_CODE_VALUES.includes(exitCode);
}

function isSuccessExitCode(exitCode: number): boolean {
  return exitCode === SUCCESS;
}

function isFailureExitCode(exitCode: number): boolean {
  return isValidExitCode(exitCode) && !isSuccessExitCode(exitCode);
}

export {
  ALL_EXIT_CODES,
  ALL_EXIT_CODE_VALUES,
  isValidExitCode,
  isSuccessExitCode,
  isFailureExitCode,
};
