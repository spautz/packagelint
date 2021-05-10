import {
  PackagelintPreparedConfig,
  PackagelintReporter,
  PackagelintReporterEventName,
  PackagelintUserConfig,
} from '@packagelint/core';

import { constructClassOrFunction } from '../util';
import { resolveReporter } from './resolveReporter';

function prepareReporters(packagelintConfig: PackagelintUserConfig): Array<PackagelintReporter> {
  return Object.keys(packagelintConfig.reporters).map((reporterName) => {
    const reporterConstructor = resolveReporter(reporterName);
    const reporterOptions = packagelintConfig.reporters[reporterName];

    return constructClassOrFunction(reporterConstructor, reporterOptions);
  });
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
