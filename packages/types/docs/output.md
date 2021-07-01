# Packagelint Types: Output

## Overview

After validation has finished, the final **Output** object summarizes the ultimate success or failure,
provides all of the individual results, and specifies the UserConfig and PreparedConfig that led to them.

This is used to determine the exit code -- success or failure -- when running via CLI.
It's also returned directly when Packagelint is run directly via API.

## PackagelintOutput

```typescript
interface PackagelintOutput {
  // Values from earlier steps (see ./configs.md)
  userConfig: PackagelintUserConfig;
  preparedConfig: PackagelintPreparedConfig;

  // Overall results
  numRulesEnabled: number;
  numRulesDisabled: number;
  numRulesPassed: number;
  numRulesFailed: number;
  exitCode: number;

  // Summary and detail information about error levels
  highestErrorLevel: PackagelintErrorLevel | null;
  errorLevelCounts: PackagelintErrorLevelCounts;

  // The full details used to generate the results
  rules: Array<PackagelintPreparedRule>;
  allResults: Array<PackagelintValidationResult>;
  errorResults: Array<PackagelintValidationError>;
}
```

### How to use it

That's up to you: when you run Packagelint via its API (see `runPackagelint()`) it will return this object.
You're free to do whatever you want with its values.
