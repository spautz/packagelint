import findUp from 'find-up';
import { PackagelintOutput, PackagelintUserConfig } from '@packagelint/types';

import { prepareConfig } from './prepare';
import { validatePreparedConfig } from './validate';

export * from './prepare';
export * from './validate';
export * from './report';

export * from './defaultUserConfig';
export * from './exitCodes';
export * from './util';

async function findPackagelintConfigFile(
  configFileName = '.packagelint.js',
  pathToSearchFrom: string = process.cwd(),
): Promise<string | undefined> {
  return findUp(configFileName, { cwd: pathToSearchFrom });
}

async function runPackagelint(userConfig: PackagelintUserConfig): Promise<PackagelintOutput> {
  const preparedConfig = await prepareConfig(userConfig);
  const validationOutput = await validatePreparedConfig(preparedConfig);
  return validationOutput;
}

export { findPackagelintConfigFile, runPackagelint };
