import findUp from 'find-up';

import { EXIT_CODE, SUCCESS, FAILURE__NO_CONFIG, doValidation, processConfig } from './validation';

interface PackagelintCliArgs {}

async function execute(argv: PackagelintCliArgs): Promise<EXIT_CODE> {
  console.log('argv = ', argv);

  const packagelintConfigFileName = await findPackagelintConfigFile();
  console.log('packagelintConfigFileName = ', packagelintConfigFileName);

  if (!packagelintConfigFileName) {
    return FAILURE__NO_CONFIG;
  }

  const packagelintUserConfig = require(packagelintConfigFileName);
  console.log('packagelintUserConfig = ', packagelintUserConfig);

  const processedConfig = processConfig(packagelintUserConfig);
  console.log('processedConfig = ', processedConfig);

  const validationResults = doValidation(processedConfig);
  console.log('validationResults = ', validationResults);

  return SUCCESS;
}

async function findPackagelintConfigFile(
  fileName = '.packagelint.js',
  pathToSearchFrom = process.cwd(),
) {
  console.log('findPackagelintConfigFile()', fileName, pathToSearchFrom);
  return findUp(fileName, { cwd: pathToSearchFrom });
}

export { execute, findPackagelintConfigFile };
