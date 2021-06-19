import { PackagelintReporterInstance, PackagelintReporterEventName } from '@packagelint/types';

type PackagelintInternalDebugReporter_EventsToLog = Record<PackagelintReporterEventName, boolean>;

export type PackagelintInternalDebugReporterOptions =
  | Partial<PackagelintInternalDebugReporter_EventsToLog>
  | boolean;

const defaultEventsToLog: PackagelintInternalDebugReporter_EventsToLog = {
  onConfigStart: true,
  onConfigReady: true,
  onValidationStart: true,
  onValidationComplete: true,
  onRuleStart: true,
  onRuleResult: true,
  getLastError: true,
};

class InternalDebugReporter implements PackagelintReporterInstance {
  _prefix = 'Packagelint InternalDebugReporter';
  _callback = console.log;
  _eventsToLog: PackagelintInternalDebugReporter_EventsToLog = defaultEventsToLog;

  constructor(options: PackagelintInternalDebugReporterOptions) {
    if (typeof options === 'object') {
      this._eventsToLog = {
        ...defaultEventsToLog,
        ...options,
      };
    } else {
      this._eventsToLog = Object.keys(defaultEventsToLog).reduce(
        (acc, eventName) => ({
          ...acc,
          [eventName]: options,
        }),
        {} as PackagelintInternalDebugReporter_EventsToLog,
      );
    }
  }

  onConfigStart(...args: Array<unknown>): void {
    this._logEvent('onConfigStart', ...args);
  }
  onConfigReady(...args: Array<unknown>): void {
    this._logEvent('onConfigReady', ...args);
  }
  onValidationStart(...args: Array<unknown>): void {
    this._logEvent('onValidationStart', ...args);
  }
  onValidationComplete(...args: Array<unknown>): void {
    this._logEvent('onValidationComplete', ...args);
  }
  onRuleStart(...args: Array<unknown>): void {
    this._logEvent('onRuleStart', ...args);
  }
  onRuleResult(...args: Array<unknown>): void {
    this._logEvent('onRuleResult', ...args);
  }
  getLastError(...args: Array<unknown>): void {
    this._logEvent('getLastError', ...args);
  }

  _logEvent(eventName: PackagelintReporterEventName, ...args: Array<any>): void {
    if (this._eventsToLog[eventName]) {
      this._callback(`${this._prefix}: ${eventName}`, ...args);
    }
  }
}

export { InternalDebugReporter };
