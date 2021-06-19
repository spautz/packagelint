// These errors are used to help validation, and sometimes to adjust the exit code. There are no functional changes.

/**
 * Used when the incoming config is invalid
 */
class PackagelintException_UserConfig extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint user config error: ${errorMessage}`);
    this.name = 'PackagelintException_UserConfig';
  }
}

/**
 * Used when the module containing a rule, ruleset, or reporter is missing or invalid
 */
class PackagelintException_Import extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint import error: ${errorMessage}`);
    this.name = 'PackagelintException_Import';
  }
}

/**
 * Used when a reporter is invalid or incomplete
 */
class PackagelintException_Reporter extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint reporter error: ${errorMessage}`);
    this.name = 'PackagelintException_Reporter';
  }
}

/**
 * Used when a rule or ruleset is invalid or incomplete
 */
class PackagelintException_RuleDefinition extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint rule config error: ${errorMessage}`);
    this.name = 'PackagelintException_RuleDefinition';
  }
}

/**
 * Used when Packagelint hits an error within itself. This should never happen.
 */
class PackagelintException_Internal extends Error {
  constructor(errorMessage: string) {
    super(`Packagelint internal error: ${errorMessage}`);
    this.name = 'PackagelintException_Internal';
  }
}

export {
  PackagelintException_UserConfig,
  PackagelintException_Import,
  PackagelintException_Reporter,
  PackagelintException_RuleDefinition,
  PackagelintException_Internal,
};
