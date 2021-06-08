class PackageLintRuleValidator_InternalPrepareError extends Error {
  constructor(errorMessage: string | Error) {
    super(`Packagelint internal error: ${errorMessage}`);
    this.name = 'PackageLintRuleValidator_InternalPrepareError';
  }
}

class DefaultRulePreparer {}

export { DefaultRulePreparer, PackageLintRuleValidator_InternalPrepareError };
