export type PackagelintExitCode = typeof ALL_EXIT_CODE_VALUES[number];

const SUCCESS = 0 as const;
const FAILURE__UNKNOWN = -1 as const;
const FAILURE__VALIDATION = 1 as const;
const FAILURE__NO_CONFIG = 2 as const;
const FAILURE__INVALID_CONFIG = 3 as const;
const FAILURE__INVALID_PREPARE = 4 as const;
const FAILURE__INVALID_VALIDATION = 5 as const;

const ALL_EXIT_CODES = {
  SUCCESS,
  FAILURE__UNKNOWN,
  FAILURE__VALIDATION,
  FAILURE__NO_CONFIG,
  FAILURE__INVALID_CONFIG,
  FAILURE__INVALID_PREPARE,
  FAILURE__INVALID_VALIDATION,
};

const ALL_EXIT_CODE_VALUES = [
  SUCCESS,
  FAILURE__UNKNOWN,
  FAILURE__VALIDATION,
  FAILURE__NO_CONFIG,
  FAILURE__INVALID_CONFIG,
  FAILURE__INVALID_PREPARE,
  FAILURE__INVALID_VALIDATION,
];

function isValidExitCode(exitCode: number): boolean {
  return ALL_EXIT_CODE_VALUES.includes(exitCode as PackagelintExitCode);
}

function isSuccessExitCode(exitCode: number): boolean {
  return exitCode === SUCCESS;
}

function isFailureExitCode(exitCode: number): boolean {
  return isValidExitCode(exitCode) && !isSuccessExitCode(exitCode);
}

export {
  SUCCESS,
  FAILURE__UNKNOWN,
  FAILURE__VALIDATION,
  FAILURE__NO_CONFIG,
  FAILURE__INVALID_CONFIG,
  FAILURE__INVALID_PREPARE,
  FAILURE__INVALID_VALIDATION,
  ALL_EXIT_CODES,
  ALL_EXIT_CODE_VALUES,
  isValidExitCode,
  isSuccessExitCode,
  isFailureExitCode,
};
