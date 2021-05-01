import { PackagelintOutputDefinition } from '../../types';

export type PackagelintOutputEventName =
  | 'constructor'
  | 'onConfigStart'
  | 'onConfigReady'
  | 'onValidationStart'
  | 'onValidationComplete'
  | 'onRuleStart'
  | 'onRuleResult'
  | 'getLastError';

type PackagelintInternalDebugOutput_EventsToLog = Record<PackagelintOutputEventName, boolean>;

export type PackagelintInternalDebugOutputOptions =
  | Partial<PackagelintInternalDebugOutput_EventsToLog>
  | boolean;

const defaultEventsToLog: PackagelintInternalDebugOutput_EventsToLog = {
  constructor: true,
  onConfigStart: true,
  onConfigReady: true,
  onValidationStart: true,
  onValidationComplete: true,
  onRuleStart: true,
  onRuleResult: true,
  getLastError: true,
};

class InternalDebugOutput
  implements PackagelintOutputDefinition<PackagelintInternalDebugOutputOptions> {
  _prefix = 'Packagelint InternalDebugOutput';
  _callback = console.log;
  _eventsToLog: PackagelintInternalDebugOutput_EventsToLog = defaultEventsToLog;

  constructor(options: PackagelintInternalDebugOutputOptions) {
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
        {} as PackagelintInternalDebugOutput_EventsToLog,
      );
    }

    this._logEvent('constructor', options);
  }

  onConfigStart(...args: Array<unknown>) {
    this._logEvent('onConfigStart', ...args);
  }
  onConfigReady(...args: Array<unknown>) {
    this._logEvent('onConfigReady', ...args);
  }
  onValidationStart(...args: Array<unknown>) {
    this._logEvent('onValidationStart', ...args);
  }
  onValidationComplete(...args: Array<unknown>) {
    this._logEvent('onValidationComplete', ...args);
  }
  onRuleStart(...args: Array<unknown>) {
    this._logEvent('onRuleStart', ...args);
  }
  onRuleResult(...args: Array<unknown>) {
    this._logEvent('onRuleResult', ...args);
  }
  getLastError(...args: Array<unknown>) {
    this._logEvent('getLastError', ...args);
  }

  _logEvent(eventName: PackagelintOutputEventName, ...args: Array<any>) {
    if (this._eventsToLog[eventName]) {
      this._callback(`${this._prefix}: ${eventName}`, ...args);
    }
  }
}

export { InternalDebugOutput };
