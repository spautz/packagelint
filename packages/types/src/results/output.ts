import { PackagelintPreparedConfig } from '../configs/preparedConfig';
import { PackagelintUserConfig } from '../configs/userConfig';
import { PackagelintErrorLevelCounts } from '../error-levels/errorLevelCounts';
import { PackagelintErrorLevel } from '../error-levels/errorLevels';
import { PackagelintRuleName } from '../rules/ruleCheck';

import { PackagelintValidationError, PackagelintValidationResult } from './validationResult';

export interface PackagelintOutput {
  // Values from earlier steps
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
  allResults: Array<PackagelintValidationResult>;
  errorResults: Array<PackagelintValidationError>;
  resultsByName: Record<PackagelintRuleName, PackagelintValidationResult>;
}
