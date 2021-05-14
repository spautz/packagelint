import findUp from 'find-up';

export * from './prepare';
export * from './validate';
export * from './report';

export * from './util';

async function findPackagelintConfigFile(
  configFileName: string = '.packagelint.js',
  pathToSearchFrom: string = process.cwd(),
): Promise<string | undefined> {
  return findUp(configFileName, { cwd: pathToSearchFrom });
}

export { findPackagelintConfigFile };
