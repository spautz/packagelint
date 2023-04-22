import fs from 'fs';
import semver from 'semver';

import {
  PackagelintRuleCheckDefinition,
  PackagelintRuleCheckValidationFn,
} from '@packagelint/types';

const { readFile } = fs.promises;

export type NvmrcRuleParams = {
  OptionsType: {
    fileName: string;
    version: string;
  };
  ErrorNames: 'fileNotFound' | 'invalidNvmrc' | 'invalidVersion';
  ErrorData: {
    nvmrcFilePaths?: Array<string> | null;
    nvmrcFileContent?: string;
  };
};

const nvmrcRuleValidation: PackagelintRuleCheckValidationFn<NvmrcRuleParams> = async (
  options,
  packageContext,
) => {
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
};

const nvmrcRuleDefinition: PackagelintRuleCheckDefinition<NvmrcRuleParams> = {
  name: 'nvmrc',
  docs: {
    url: 'https://github.com/spautz/packagelint',
    description: 'Require a .nvmrc file, maybe with a specific version range',
  },
  defaultOptions: {
    fileName: '.nvmrc',
    version: '>=10',
  },
  validationMessages: {
    en: {
      fileNotFound: '{{fileName}} not found',
      invalidNvmrc: 'Invalid {{fileName}}: must contain a version number',
      invalidVersion: 'Invalid Node version in {{fileName}}: must match "{{version}}"',
    },
  },
  doValidation: nvmrcRuleValidation,
};

export { nvmrcRuleDefinition, nvmrcRuleValidation };
