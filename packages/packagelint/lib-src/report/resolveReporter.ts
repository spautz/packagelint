import {
  PackagelintReporterName,
  PackagelintReporterConstructor,
  PackagelintExportedReporters,
} from '@packagelint/core';
import { PackagelintImportException, PackagelintUserConfigException } from '@packagelint/types';

import { resolveImportedValue } from '../util';

async function resolveReporter(
  name: PackagelintReporterName,
): Promise<PackagelintReporterConstructor> {
  // @TODO: Implement this properly
  // @TODO: Validation

  const [packageName, reporterName] = name.split(':');

  if (!packageName || !reporterName) {
    throw new PackagelintUserConfigException(`Reporter "${name}" is not a valid reporter name`);
  }

  const packageExports = await resolveImportedValue<PackagelintExportedReporters>(
    require(packageName),
  );
  const packagelintReporters = await resolveImportedValue<
    PackagelintExportedReporters['packagelintReporters']
  >(packageExports.packagelintReporters);

  if (!packagelintReporters) {
    throw new PackagelintImportException(
      `Package "${packageName}" does not provide any packagelint reporters`,
    );
  }
  if (typeof packagelintReporters !== 'object') {
    throw new PackagelintImportException(
      `Package "${packageName}" does not provide any valid packagelint reporters`,
    );
  }
  if (!Object.prototype.hasOwnProperty.call(packagelintReporters, reporterName)) {
    throw new PackagelintImportException(
      `Package "${packageName}" does not provide reporter "${reporterName}"`,
    );
  }

  return packagelintReporters[reporterName];
}

export { resolveReporter };
