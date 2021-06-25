import { PackagelintReporterConstructor } from './reporters';
import { PackagelintRuleDefinition, PackagelintRulesetDefinition } from './rules';

/**
 * When a module exports a Rule or Reporter, it may provide it as a direct value, or a function that returns the value,
 * or a promise that resolves to the value, or a function that returns a promise that resolves to the value.
 *
 * So long as the module eventually delivers the desired Rule or Reporter, we'll use it.
 */
type FlexibleExportType<T> = T | Promise<T> | (() => T | Promise<T>);

/**
 * A module that provides rules MUST export them within a `packagelintRules` named export.
 *
 * A rule entry for "some-module:your-rule-name" effectively becomes:
 *    import { packagelintRules } from 'some-module';
 *    return packagelintRules['your-rule-name'];
 *
 * (With additional handling for async values or factory functions)
 */
export type PackagelintExportedRules = FlexibleExportType<{
  packagelintRules: Record<
    string,
    FlexibleExportType<PackagelintRuleDefinition | PackagelintRulesetDefinition>
  >;
}>;

export type PackagelintImportedRules = {
  packagelintRules: Record<string, PackagelintRuleDefinition | PackagelintRulesetDefinition>;
};

/**
 * A module that provides reporters MUST export them within a `packagelintReporters` named export.
 *
 * A reporter entry for "some-module:your-reporter-name" effectively becomes:
 *    import { packagelintReporters } from 'some-module';
 *    return packagelintReporters['your-reporter-name'];
 *
 * (With additional handling for async values or factory functions)
 */
export type PackagelintExportedReporters = FlexibleExportType<{
  packagelintReporters: Record<string, FlexibleExportType<PackagelintReporterConstructor>>;
}>;

export type PackagelintImportedReporters = {
  packagelintReporters: Record<string, PackagelintReporterConstructor>;
};
