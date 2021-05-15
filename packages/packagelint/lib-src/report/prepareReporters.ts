import {
  PackagelintPreparedConfig,
  PackagelintReporter,
  PackagelintReporterEventName,
  PackagelintUserConfig,
} from '@packagelint/core';

import { constructClassOrFunction } from '../util';
import { resolveReporter } from './resolveReporter';

async function prepareReporters(
  packagelintConfig: PackagelintUserConfig,
): Promise<Array<PackagelintReporter>> {
  const allPendingReporters: Array<Promise<PackagelintReporter>> = Object.keys(
    packagelintConfig.reporters,
  ).map(async (reporterName): Promise<PackagelintReporter> => {
    const reporterConstructor = await resolveReporter(reporterName);
    const reporterOptions = packagelintConfig.reporters[reporterName];

    return constructClassOrFunction(reporterConstructor, reporterOptions);
  });

  return Promise.all(allPendingReporters);
}

function broadcastEvent(
  preparedConfig: PackagelintPreparedConfig,
  eventName: PackagelintReporterEventName,
  ...eventArgs: Array<any>
): Promise<Array<void | unknown>> {
  return broadcastEventUsingReporters(preparedConfig.reporters, eventName, ...eventArgs);
}

function broadcastEventUsingReporters(
  reporters: Array<PackagelintReporter>,
  eventName: PackagelintReporterEventName,
  ...eventArgs: Array<any>
): Promise<Array<void | unknown>> {
  const allReporterResults = reporters.map((reporterInstance: PackagelintReporter) => {
    if (reporterInstance[eventName]) {
      // @TODO: More error-checking
      // @ts-ignore
      return reporterInstance[eventName](...eventArgs);
    }
    return null;
  });
  return Promise.all(allReporterResults);
}

export { prepareReporters, broadcastEvent, broadcastEventUsingReporters, constructClassOrFunction };
