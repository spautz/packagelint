# Packagelint Types: Output

## Overview

After validation has finished, the final **Output** object summarizes the ultimate success or failure,
provides all of the individual results, and retains the UserConfig and PreparedConfig that led to them.

This is used to determine the exit code -- success or failure -- when running via CLI.

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
  errorLevelCounts: {
    exception: number;
    error: number;
    warning: number;
    suggestion: number;
    ignore: number;
  };

  // The full details used to generate the results
  allResults: Array<PackagelintValidationResult>;
  errorResults: Array<PackagelintValidationError>;
  resultsByName: Record<PackagelintRuleName, PackagelintValidationResult>;
}
```

### How to use it

That's up to you: when you run Packagelint via its API (see `runPackagelint()`) it will return this object.
You're free to do whatever you want with its values.

## PackagelintValidationResult

```typescript
type PackagelintValidationResult = {
  preparedRule: PackagelintPreparedRule;
  errorName: string;
  errorData?: ErrorDataType;
  errorLevel: PackagelintErrorLevel;
  errorMessage: string;
} | null;
```

### How to use it

If you're processing results yourself after calling Packagelint via its API, this will be available for each rule.
This is also what each ruleInput in a **RuleCombo**'d evaluation function receives, for each input rule.

`null` indicates that the validation was successful; the above object indicates it was not successful.
