import {
  PackagelintException_Import,
  PackagelintException_UserConfig,
  PackagelintExportedReportersObject,
  PackagelintReporterConstructor,
  PackagelintReporterName,
  PackagelintResolved3rdPartyModule,
  PackagelintResolved3rdPartyModuleObject,
  resolveImportedValue,
} from '@packagelint/types';

async function resolveReporter(
  name: PackagelintReporterName,
): Promise<PackagelintReporterConstructor> {
  // @TODO: Implement this properly
  // @TODO: Validation

  const [packageName, reporterName] = name.split(':');

  if (!packageName || !reporterName) {
    throw new PackagelintException_UserConfig(`Reporter "${name}" is not a valid reporter name`);
  }

  const packageExports = await resolveImportedValue<PackagelintResolved3rdPartyModuleObject>(
    import(packageName) as PackagelintResolved3rdPartyModule,
  );
  const packagelintReporters = await resolveImportedValue<
    PackagelintExportedReportersObject | undefined
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
