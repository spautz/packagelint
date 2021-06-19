import fs from 'fs';
import semver from 'semver';

import { PackagelintRuleDefinition, PackagelintValidationContext } from '@packagelint/types';

const { readFile } = fs.promises;

export type NvmrcRuleOptions = {
  fileName: string;
  version: string;
};

const nvmrcRuleDefinition: PackagelintRuleDefinition<NvmrcRuleOptions> = {
  name: 'nvmrc',
  docs: {
    description: 'Require a .nvmrc file, maybe with a specific version range',
    url: 'https://github.com/spautz/packagelint',
  },
  defaultOptions: {
    fileName: '.nvmrc',
    version: '>=10',
  },
  messages: {
    fileNotFound: '{{fileName}} not found',
    invalidNvmrc: 'Invalid {{fileName}}: must contain a version number',
    invalidVersion: 'Invalid Node version in {{fileName}}: must match "{{version}}"',
  },
  doValidation: nvmrcRuleValidation,
};

async function nvmrcRuleValidation(
  options: NvmrcRuleOptions,
  packageContext: PackagelintValidationContext,
) {
  const { fileName, version } = options;
  const { findFileUp, createErrorToReturn, setErrorData } = packageContext;

  const nvmrcFilePaths = await findFileUp(fileName);
  setErrorData({ nvmrcFilePaths });
  if (!nvmrcFilePaths || nvmrcFilePaths.length !== 1) {
    return createErrorToReturn('fileNotFound');
  }

  const nvmrcFileContent = await readFile(nvmrcFilePaths[0]).toString();
  setErrorData({ nvmrcFileContent });
  if (!nvmrcFileContent || !semver.valid(nvmrcFileContent)) {
    return createErrorToReturn('invalidNvmrc');
  }

  if (!semver.satisfies(nvmrcFileContent, version)) {
    return createErrorToReturn('invalidVersion');
  }

  return null;
}

export { nvmrcRuleDefinition, nvmrcRuleValidation };
