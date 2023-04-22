import { PackagelintErrorLevel } from '../error-levels/errorLevels';
import { PackagelintPreparedRule } from '../rules/preparedRule';
import { PackagelintRuleName, PackagelintUnknownRuleErrorData } from '../rules/ruleCheck';

// Return value (and possible error) from a single validation function
// See `PackagelintValidationFnReturn` for the literal return value

export type PackagelintValidationError = {
  name: PackagelintRuleName;
  preparedRule: PackagelintPreparedRule;
  errorName: string;
  errorData?: PackagelintUnknownRuleErrorData;
  errorLevel: PackagelintErrorLevel;
  errorMessage: string;
};

export type PackagelintValidationResult = PackagelintValidationError | null;
