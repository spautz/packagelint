import { PackagelintErrorLevel, PackagelintErrorLevelCounts } from '../error-levels';
import { PackagelintRuleName } from '../rules';
import { PackagelintPreparedRule } from '../internals';

// Return value (and possible error) from a single validation function

export type PackagelintAnyErrorData = Record<string, any>;
export type PackagelintUnknownErrorData = Record<string, unknown>;

export type PackagelintValidationResult<
  ErrorDataType extends PackagelintAnyErrorData = PackagelintUnknownErrorData,
> = PackagelintValidationError<ErrorDataType> | null | undefined;

export interface PackagelintValidationError<
  ErrorDataType extends PackagelintAnyErrorData = PackagelintUnknownErrorData,
> {
  preparedRuleName: PackagelintRuleName;
  errorLevel: PackagelintErrorLevel;
  errorName: string | null;
  errorData: ErrorDataType | null;
  message: string;
}

// Final validation results

export interface PackagelintOutput {
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
