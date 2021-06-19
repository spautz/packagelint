// These errors are used to help validation, and sometimes to adjust the exit code. There are no functional changes.

/**
 * Used when the incoming config is invalid
 */
class PackageLintUserConfigError extends Error {
  constructor(errorMessage: string | Error) {
    super(`Packagelint user config error: ${errorMessage}`);
    this.name = 'PackageLintUserConfigError';
  }
}

/**
 * Used when the module containing a rule, ruleset, or reporter is missing or invalid
 */
class PackageLintImportError extends Error {
  constructor(errorMessage: string | Error) {
    super(`Packagelint import error: ${errorMessage}`);
    this.name = 'PackageLintImportError';
  }
}

/**
 * Used when a reporter is invalid or incomplete
 */
class PackageLintReporterError extends Error {
  constructor(errorMessage: string | Error) {
    super(`Packagelint reporter error: ${errorMessage}`);
    this.name = 'PackageLintReporterError';
  }
}

/**
 * Used when a rule or ruleset is invalid or incomplete
 */
class PackageLintRuleDefinitionError extends Error {
  constructor(errorMessage: string | Error) {
    super(`Packagelint rule config error: ${errorMessage}`);
    this.name = 'PackageLintRuleDefinitionError';
  }
}

/**
 * Used when Packagelint hits an error within itself. This should never happen.
 */
class PackageLintInternalError extends Error {
  constructor(errorMessage: string | Error) {
    super(`Packagelint internal error: ${errorMessage}`);
    this.name = 'PackageLintInternalError';
  }
}

export {
  PackageLintUserConfigError,
  PackageLintImportError,
  PackageLintReporterError,
  PackageLintRuleDefinitionError,
  PackageLintInternalError,
};
