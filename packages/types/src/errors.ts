// These errors are used to help validation, and sometimes to adjust the exit code. There are no functional changes.

/**
 * Used when the incoming config is invalid
 */
class PackagelintUserConfigError extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint user config error: ${errorMessage}`);
    this.name = 'PackagelintUserConfigError';
  }
}

/**
 * Used when the module containing a rule, ruleset, or reporter is missing or invalid
 */
class PackagelintImportError extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint import error: ${errorMessage}`);
    this.name = 'PackagelintImportError';
  }
}

/**
 * Used when a reporter is invalid or incomplete
 */
class PackagelintReporterError extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint reporter error: ${errorMessage}`);
    this.name = 'PackagelintReporterError';
  }
}

/**
 * Used when a rule or ruleset is invalid or incomplete
 */
class PackagelintRuleDefinitionError extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint rule config error: ${errorMessage}`);
    this.name = 'PackagelintRuleDefinitionError';
  }
}

/**
 * Used when Packagelint hits an error within itself. This should never happen.
 */
class PackagelintInternalError extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint internal error: ${errorMessage}`);
    this.name = 'PackagelintInternalError';
  }
}

export {
  PackagelintUserConfigError,
  PackagelintImportError,
  PackagelintReporterError,
  PackagelintRuleDefinitionError,
  PackagelintInternalError,
};
