import {
  PackagelintException_Import,
  PackagelintException_UserConfig,
  PackagelintImportedReporters,
  PackagelintReporterConstructor,
  PackagelintReporterName,
} from '@packagelint/types';

import { resolveImportedValue } from '../util';

async function resolveReporter(
  name: PackagelintReporterName,
): Promise<PackagelintReporterConstructor> {
  // @TODO: Implement this properly
  // @TODO: Validation

  const [packageName, reporterName] = name.split(':');

  if (!packageName || !reporterName) {
    throw new PackagelintException_UserConfig(`Reporter "${name}" is not a valid reporter name`);
  }

  const packageExports = await resolveImportedValue<PackagelintImportedReporters>(
    require(packageName),
  );
  const packagelintReporters = await resolveImportedValue<
    PackagelintImportedReporters['packagelintReporters']
  >(packageExports.packagelintReporters);

  if (!packagelintReporters) {
    throw new PackagelintException_Import(
      `Package "${packageName}" does not provide any packagelint reporters`,
    );
  }
  if (typeof packagelintReporters !== 'object') {
    throw new PackagelintException_Import(
      `Package "${packageName}" does not provide any valid packagelint reporters`,
    );
  }
  if (!Object.prototype.hasOwnProperty.call(packagelintReporters, reporterName)) {
    throw new PackagelintException_Import(
      `Package "${packageName}" does not provide reporter "${reporterName}"`,
    );
  }

  return packagelintReporters[reporterName];
}

export { resolveReporter };
