import {
  PackagelintPreparedConfig,
  PackagelintReporter,
  PackagelintReporterClassConstructor,
  PackagelintReporterConstructor,
  PackagelintReporterConstructorFunction,
  PackagelintReporterEventName,
  PackagelintUserConfig,
} from '@packagelint/core';
import { resolveReporter } from './resolveReporter';

function constructClassOrFunction(
  ReporterClassOrConstructor: PackagelintReporterConstructor,
  reporterOptions: any,
): PackagelintReporter {
  try {
    return new (ReporterClassOrConstructor as PackagelintReporterClassConstructor)(reporterOptions);
  } catch (err) {
    return (ReporterClassOrConstructor as PackagelintReporterConstructorFunction)(reporterOptions);
  }
}

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
): Promise<void> | void {
  return broadcastEventUsingReporters(preparedConfig.reporters, eventName, ...eventArgs);
}

function broadcastEventUsingReporters(
  reporters: Array<PackagelintReporter>,
  eventName: PackagelintReporterEventName,
  ...eventArgs: Array<any>
): Promise<void> | void {
  reporters.forEach((reporterInstance: PackagelintReporter) => {
    if (reporterInstance[eventName]) {
      // @TODO: More error-checking
      // @ts-ignore
      reporterInstance[eventName](...eventArgs);
    }
  });
}

export { prepareReporters, broadcastEvent, broadcastEventUsingReporters, constructClassOrFunction };
