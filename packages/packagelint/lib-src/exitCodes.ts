export type PackagelintExitCode = typeof ALL_EXIT_CODE_VALUES[number];

const EXIT__SUCCESS = 0 as const;
const EXIT__UNKNOWN = -1 as const;
const EXIT__VALIDATION_FAILED = 1 as const;
const EXIT__INTERNAL_ERROR = 2 as const;
const EXIT__NO_CONFIG = 3 as const;
const EXIT__INVALID_CONFIG = 4 as const;
const EXIT__INVALID_REPORTER = 5 as const;
const EXIT__INVALID_RULE = 6 as const;

const ALL_EXIT_CODES = {
  SUCCESS: EXIT__SUCCESS,
  UNKNOWN: EXIT__UNKNOWN,
  VALIDATION_FAILED: EXIT__VALIDATION_FAILED,
  INTERNAL_ERROR: EXIT__INTERNAL_ERROR,
  NO_CONFIG: EXIT__NO_CONFIG,
  INVALID_CONFIG: EXIT__INVALID_CONFIG,
  INVALID_REPORTER: EXIT__INVALID_REPORTER,
  INVALID_RULE: EXIT__INVALID_RULE,
};

const ALL_EXIT_CODE_VALUES = [
  EXIT__SUCCESS,
  EXIT__UNKNOWN,
  EXIT__VALIDATION_FAILED,
  EXIT__INTERNAL_ERROR,
  EXIT__NO_CONFIG,
  EXIT__INVALID_CONFIG,
  EXIT__INVALID_REPORTER,
  EXIT__INVALID_RULE,
];

function isValidExitCode(exitCode: unknown): boolean {
  return ALL_EXIT_CODE_VALUES.includes(exitCode as PackagelintExitCode);
}

function isSuccessExitCode(exitCode: unknown): boolean {
  return exitCode === EXIT__SUCCESS;
}

function isFailureExitCode(exitCode: unknown): boolean {
  return isValidExitCode(exitCode) && !isSuccessExitCode(exitCode);
}

export {
  EXIT__SUCCESS,
  EXIT__UNKNOWN,
  EXIT__VALIDATION_FAILED,
  EXIT__INTERNAL_ERROR,
  EXIT__NO_CONFIG,
  EXIT__INVALID_CONFIG,
  EXIT__INVALID_REPORTER,
  EXIT__INVALID_RULE,
  ALL_EXIT_CODES,
  ALL_EXIT_CODE_VALUES,
  isValidExitCode,
  isSuccessExitCode,
  isFailureExitCode,
};
