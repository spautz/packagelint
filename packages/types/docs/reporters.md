# Packagelint Types: Reporters

## Overview

Like unit test reporters, a Packagelint **Reporter** can output results to the console or to a file.

Packagelint supports Jest reporters out of the box, as well as Packagelint-specific reporters.

## PackagelintReporterInstance

```typescript
interface PackagelintReporterInstance {
  onConfigStart: (userConfig: PackagelintUserConfig) => PackagelintUnknownReporterReturnValue;

  onConfigReady: (
    preparedConfig: PackagelintPreparedConfig,
  ) => PackagelintUnknownReporterReturnValue;

  onValidationStart: (
    preparedConfig: PackagelintPreparedConfig,
  ) => PackagelintUnknownReporterReturnValue;

  onValidationComplete: (fullResults: PackagelintOutput) => PackagelintUnknownReporterReturnValue;

  onRuleStart: (preparedRule: PackagelintPreparedRule) => PackagelintUnknownReporterReturnValue;

  onRuleResult: (
    preparedRule: PackagelintPreparedRule,
    ruleResult: PackagelintValidationResult,
  ) => PackagelintUnknownReporterReturnValue;

  getLastError: () => Error | void;
}
```

### How to use it

If you're authoring your own reporter, as a library author, then you must export a class or constructor function
which returns this shape. The different handlers will be called during rule preparation, rule validation, and once
the final output is ready.
