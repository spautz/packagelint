// These errors are used to adjust the exit code, and to help validation. There are no functional
// changes other than the name.

class PackageLintRuleValidator_UserConfigError extends Error {
  constructor(errorMessage: string | Error) {
    super(`Packagelint user config error: ${errorMessage}`);
    this.name = 'PackageLintRuleValidator_UserConfigError';
  }
}

class PackageLintRuleValidator_ExternalModuleError extends Error {
  constructor(errorMessage: string | Error) {
    super(`Packagelint reporter config error: ${errorMessage}`);
    this.name = 'PackageLintRuleValidator_ReporterConfigError';
  }
}

class PackageLintRuleValidator_ReporterConfigError extends Error {
  constructor(errorMessage: string | Error) {
    super(`Packagelint reporter config error: ${errorMessage}`);
    this.name = 'PackageLintRuleValidator_ReporterConfigError';
  }
}

class PackageLintRuleValidator_RuleConfigError extends Error {
  constructor(errorMessage: string | Error) {
    super(`Packagelint reporter config error: ${errorMessage}`);
    this.name = 'PackageLintRuleValidator_ReporterConfigError';
  }
}

class PackageLintRuleValidator_InternalPrepareError extends Error {
  constructor(errorMessage: string | Error) {
    super(`Packagelint internal prepare error: ${errorMessage}`);
    this.name = 'PackageLintRuleValidator_InternalPrepareError';
  }
}

class PackageLintRuleValidator_InternalValidateError extends Error {
  constructor(errorMessage: string | Error) {
    super(`Packagelint internal validate error: ${errorMessage}`);
    this.name = 'PackageLintRuleValidator_InternalValidateError';
  }
}

export {
  PackageLintRuleValidator_UserConfigError,
  PackageLintRuleValidator_ExternalModuleError,
  PackageLintRuleValidator_ReporterConfigError,
  PackageLintRuleValidator_RuleConfigError,
  PackageLintRuleValidator_InternalPrepareError,
  PackageLintRuleValidator_InternalValidateError,
};
