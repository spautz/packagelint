import { PackagelintOutputName, PackagelintOutputDefinition } from '@packagelint/core';

function resolveOutput(name: PackagelintOutputName): PackagelintOutputDefinition {
  // @TODO: Implement this properly
  // @TODO: Validation

  const [packageName, outputName] = name.split(':');

  if (!packageName || !outputName) {
    throw new Error(`Output "${name}" is not a valid output name`);
  }

  const { packagelintOutputs } = require(packageName);

  if (!packagelintOutputs) {
    throw new Error(`Package "${packageName}" does not provide any packagelint outputs`);
  }
  if (typeof packagelintOutputs !== 'object') {
    throw new Error(`Package "${packageName}" does not provide any valid packagelint outputs`);
  }
  if (!Object.prototype.hasOwnProperty.call(packagelintOutputs, outputName)) {
    throw new Error(`Package "${packageName}" does not provide output "${outputName}"`);
  }

  return packagelintOutputs[outputName];
}

export { resolveOutput };
