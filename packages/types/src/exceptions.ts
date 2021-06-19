// These errors are used to help validation, and sometimes to adjust the exit code. There are no functional changes.

/**
 * Used when the incoming config is invalid
 */
class PackagelintUserConfigException extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint user config error: ${errorMessage}`);
    this.name = 'PackagelintUserConfigException';
  }
}

/**
 * Used when the module containing a rule, ruleset, or reporter is missing or invalid
 */
class PackagelintImportException extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint import error: ${errorMessage}`);
    this.name = 'PackagelintImportException';
  }
}

/**
 * Used when a reporter is invalid or incomplete
 */
class PackagelintReporterException extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint reporter error: ${errorMessage}`);
    this.name = 'PackagelintReporterException';
  }
}

/**
 * Used when a rule or ruleset is invalid or incomplete
 */
class PackagelintRuleDefinitionException extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint rule config error: ${errorMessage}`);
    this.name = 'PackagelintRuleDefinitionException';
  }
}

/**
 * Used when Packagelint hits an error within itself. This should never happen.
 */
class PackagelintInternalException extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint internal error: ${errorMessage}`);
    this.name = 'PackagelintInternalException';
  }
}

export {
  PackagelintUserConfigException,
  PackagelintImportException,
  PackagelintReporterException,
  PackagelintRuleDefinitionException,
  PackagelintInternalException,
};
