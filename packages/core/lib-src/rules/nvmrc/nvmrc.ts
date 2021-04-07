import { readFile } from 'fs/promises';
import semver from 'semver';

import { PackagelintRuleContext, PackagelintRuleInfo } from '../ruleTypes';

export type NvmrcRuleOptions = {
  fileName: string;
  version: string;
};

const nvmrcRuleInfo: PackagelintRuleInfo<NvmrcRuleOptions> = {
  name: '@packagelint/core/nvmrc',
  docs: {
    description: 'require a .nvmrc file',
    url: 'https://github.com/spautz/packagelint',
  },
  defaultOptions: {
    fileName: '.nvmrc',
    version: '>=10',
  },
  optionsSchema: {
    fileName: 'string',
    version: 'semver',
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
  packageContext: PackagelintRuleContext,
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

export { nvmrcRuleInfo, nvmrcRuleValidation, nvmrcRuleInfo as rule };
