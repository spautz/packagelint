import { PackagelintException_Import } from '../exceptions';
import {
  PackagelintFlexibleExportType,
  PackagelintResolved3rdPartyModule,
  PackagelintResolved3rdPartyModuleObject,
} from './types';
import { PACKAGELINT_REPORTER_EXPORTS_KEY, PACKAGELINT_RULE_EXPORTS_KEY } from './exportKeys';

/**
 * Validation function that a module may use to ensure its rule and/or reporter exports match the spec.
 */
async function checkPackagelintExports(
  moduleExports: PackagelintResolved3rdPartyModule,
): Promise<void> {
  if (!moduleExports) {
    throw new PackagelintException_Import(
      'checkPackagelintExports failed: no module given to check',
    );
  }

  // Resolve the module itself, if needed
  let resolvedModuleExports = await resolveImportedValue<PackagelintResolved3rdPartyModuleObject>(
    moduleExports,
  );
  if (!resolvedModuleExports || typeof resolvedModuleExports !== 'object') {
    throw new PackagelintException_Import(
      'checkPackagelintExports failed: module did not resolve to a value',
    );
  }

  const {
    [PACKAGELINT_RULE_EXPORTS_KEY]: packagelintRules,
    [PACKAGELINT_REPORTER_EXPORTS_KEY]: packagelintReporters,
  } = resolvedModuleExports;

  if (!packagelintRules && !packagelintReporters) {
    throw new PackagelintException_Import(
      `checkPackagelintExports failed: module provides neither ${PACKAGELINT_RULE_EXPORTS_KEY} nor ${PACKAGELINT_REPORTER_EXPORTS_KEY}`,
    );
  }

  // @TODO: Resolve and check packagelintRules

  // @TODO: Resolve and check packagelintReporters
}

// This needs to be a standalone function so that it can be used as a type guard
function isFunction(someValue: unknown): someValue is Function {
  return typeof someValue === 'function';
}

/**
 * When importing configs, rules, presets, or reporters, the value may be exported directly, or wrapped in a promise
 * or function. This standardizes the imported value so that it's always delivered via a promise.
 */
async function resolveImportedValue<ExpectedType>(
  rawValue: PackagelintFlexibleExportType<ExpectedType>,
): Promise<ExpectedType> {
  if (isFunction(rawValue)) {
    return rawValue();
  } else {
    return rawValue;
  }
}

export { checkPackagelintExports, isFunction, resolveImportedValue };
