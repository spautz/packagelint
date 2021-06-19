export type PackagelintExitCode = typeof ALL_EXIT_CODE_VALUES[number];

const SUCCESS = 0 as const;
const FAILURE__UNKNOWN = -1 as const;
const FAILURE__VALIDATION = 1 as const;
const FAILURE__INTERNAL = 2 as const;
const FAILURE__NO_CONFIG = 3 as const;
const FAILURE__INVALID_CONFIG = 4 as const;
const FAILURE__INVALID_REPORTER = 5 as const;
const FAILURE__INVALID_RULE = 6 as const;

const ALL_EXIT_CODES = {
  SUCCESS,
  FAILURE__UNKNOWN,
  FAILURE__VALIDATION,
  FAILURE__INTERNAL,
  FAILURE__NO_CONFIG,
  FAILURE__INVALID_CONFIG,
  FAILURE__INVALID_REPORTER,
  FAILURE__INVALID_RULE,
};

const ALL_EXIT_CODE_VALUES = [
  SUCCESS,
  FAILURE__UNKNOWN,
  FAILURE__VALIDATION,
  FAILURE__INTERNAL,
  FAILURE__NO_CONFIG,
  FAILURE__INVALID_CONFIG,
  FAILURE__INVALID_REPORTER,
  FAILURE__INVALID_RULE,
];

function isValidExitCode(exitCode: unknown): boolean {
  return ALL_EXIT_CODE_VALUES.includes(exitCode as PackagelintExitCode);
}

function isSuccessExitCode(exitCode: unknown): boolean {
  return exitCode === SUCCESS;
}

function isFailureExitCode(exitCode: unknown): boolean {
  return isValidExitCode(exitCode) && !isSuccessExitCode(exitCode);
}

export {
  SUCCESS,
  FAILURE__UNKNOWN,
  FAILURE__VALIDATION,
  FAILURE__INTERNAL,
  FAILURE__NO_CONFIG,
  FAILURE__INVALID_CONFIG,
  FAILURE__INVALID_REPORTER,
  FAILURE__INVALID_RULE,
  ALL_EXIT_CODES,
  ALL_EXIT_CODE_VALUES,
  isValidExitCode,
  isSuccessExitCode,
  isFailureExitCode,
};
