import { PackagelintReporterConstructor } from '../reporters';
import { PackagelintRuleDefinition, PackagelintRulesetDefinition } from '../rules';

import { PACKAGELINT_RULE_EXPORTS_KEY, PACKAGELINT_REPORTER_EXPORTS_KEY } from './exportKeys';

type ResolvePossiblePromise<T> = T extends Promise<infer U> ? U : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResolvePossibleFunction<T> = T extends (...args: any) => any ? ReturnType<T> : T;

export type PackagelintFlexibleExportType<T> = T | Promise<T> | (() => T | Promise<T>);

export type PackagelintResolveFlexibleExportType<T> = ResolvePossiblePromise<
  ResolvePossibleFunction<T>
>;

/**
 * A module that provides rules MUST export them within a `packagelintRules` named export.
 *
 * The rules should be in a plain object, each keyed by its name. The `packagelintRules` export may be the object
 * directly, or a function that returns the object (sync or async), or a promise that resolves to the object.
 *
 * A rule entry for "some-module:your-rule-name" effectively becomes:
 *    import { packagelintRules } from 'some-module';
 *    const availableRules = await packagelintRules;  // or await packagelintRules()
 *    return availableRules['your-rule-name'];
 */
export type PackagelintExportedRules =
  PackagelintFlexibleExportType<PackagelintExportedRulesObject>;

export type PackagelintExportedRulesObject = Record<
  string,
  PackagelintRuleDefinition | PackagelintRulesetDefinition
>;

/**
 * A module that provides reporters MUST export them within a `packagelintReporters` named export.
 *
 * The reporters should be in a plain object, each keyed by its name. The `packagelintReporters` export may be the
 * object directly, or a function that returns the object (sync or async), or a promise that resolves to the object.
 *
 * A reporter entry for "some-module:your-reporter-name" effectively becomes:
 *    import { packagelintReporters } from 'some-module';
 *    const availableReporters = await packagelintReporters;  // or await packagelintReporters()
 *    return availableReporters['your-reporter-name'];
 */
export type PackagelintExportedReporters =
  PackagelintFlexibleExportType<PackagelintExportedReportersObject>;

export type PackagelintExportedReportersObject = Record<string, PackagelintReporterConstructor>;

/**
 * Combining the above, this is the expected typing for a module that we can import rules/reporters from
 */
export type PackagelintResolved3rdPartyModule =
  PackagelintFlexibleExportType<PackagelintResolved3rdPartyModuleObject>;

export type PackagelintResolved3rdPartyModuleObject = {
  [PACKAGELINT_RULE_EXPORTS_KEY]?: PackagelintExportedRules;
  [PACKAGELINT_REPORTER_EXPORTS_KEY]?: PackagelintExportedReporters;
  [otherNamedExport: string]: unknown;
};
