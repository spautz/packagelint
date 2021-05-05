import { PackagelintReporterName, PackagelintReporterConstructor } from '@packagelint/types';

function resolveReporter(name: PackagelintReporterName): PackagelintReporterConstructor {
  // @TODO: Implement this properly
  // @TODO: Validation

  const [packageName, reporterName] = name.split(':');

  if (!packageName || !reporterName) {
    throw new Error(`Reporter "${name}" is not a valid reporter name`);
  }

  const { packagelintReporters } = require(packageName);

  if (!packagelintReporters) {
    throw new Error(`Package "${packageName}" does not provide any packagelint reporters`);
  }
  if (typeof packagelintReporters !== 'object') {
    throw new Error(`Package "${packageName}" does not provide any valid packagelint reporters`);
  }
  if (!Object.prototype.hasOwnProperty.call(packagelintReporters, reporterName)) {
    throw new Error(`Package "${packageName}" does not provide reporter "${reporterName}"`);
  }

  return packagelintReporters[reporterName];
}

export { resolveReporter };
