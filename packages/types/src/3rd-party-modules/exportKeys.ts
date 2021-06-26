/**
 * A module that provides rules MUST export them within a `packagelintRules` named export.
 */
const PACKAGELINT_RULE_EXPORTS_KEY = 'packagelintRules' as const;

/**
 * A module that provides reporters MUST export them within a `packagelintReporters` named export.
 */
const PACKAGELINT_REPORTER_EXPORTS_KEY = 'packagelintReporters' as const;

export { PACKAGELINT_RULE_EXPORTS_KEY, PACKAGELINT_REPORTER_EXPORTS_KEY };
