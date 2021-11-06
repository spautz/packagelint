import {
  PackagelintPreparedConfig,
  PackagelintReporterEventName,
  PackagelintReporterInstance,
  PackagelintUserConfig,
} from '@packagelint/types';

import { constructClassOrFunction } from '../util';
import { resolveReporter } from './resolveReporter';

async function prepareReporters(
  packagelintConfig: PackagelintUserConfig,
): Promise<Array<PackagelintReporterInstance>> {
  const allPendingReporters: Array<Promise<PackagelintReporterInstance>> = Object.keys(
    packagelintConfig.reporters,
  ).map(async (reporterName): Promise<PackagelintReporterInstance> => {
    const reporterConstructor = await resolveReporter(reporterName);
    const reporterOptions = packagelintConfig.reporters[reporterName];

    return constructClassOrFunction(reporterConstructor, reporterOptions);
  });

  return Promise.all(allPendingReporters);
}

function broadcastEvent(
  preparedConfig: PackagelintPreparedConfig,
  eventName: PackagelintReporterEventName,
  ...eventArgs: Array<unknown>
): Promise<Array<void | unknown>> {
  return broadcastEventUsingReporters(preparedConfig.reporters, eventName, ...eventArgs);
}

function broadcastEventUsingReporters(
  reporters: Array<PackagelintReporterInstance>,
  eventName: PackagelintReporterEventName,
  ...eventArgs: Array<unknown>
): Promise<Array<void | unknown>> {
  const allReporterResults = reporters.map((reporterInstance: PackagelintReporterInstance) => {
    if (reporterInstance[eventName]) {
      // @TODO: More error-checking

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return reporterInstance[eventName](...eventArgs);
    }
    return null;
  });
  return Promise.all(allReporterResults);
}

export { prepareReporters, broadcastEvent, broadcastEventUsingReporters, constructClassOrFunction };
