import { PackagelintRuleEntryConfig } from '../configs/ruleEntry';
import { PackagelintErrorLevel } from '../error-levels/errorLevels';
import { PackagelintValidationResult } from '../results/validationResult';
import { PackagelintLanguageCode } from '../languageCodes';

import {
  PackagelintRuleName,
  PackagelintRuleValidationFnContext,
  PackagelintUnknownRuleOptions,
} from './ruleCheck';

/**
 * After a rule entry has been processed, it results in one or more RuleChecks. Each RuleCheck, when fully resolved
 * and merged, becomes its own PreparedRule.
 */
export interface PackagelintPreparedRule {
  name: PackagelintRuleName;
  enabled: boolean;
  docs: {
    url: string;
    [key: string]: string;
  };
  extendedFrom: PackagelintRuleName | null;
  originalRuleEntries: Array<PackagelintRuleEntryConfig>;
  wasResolved: boolean;
  defaultErrorLevel: PackagelintErrorLevel;
  errorLevel: PackagelintErrorLevel;
  defaultOptions: PackagelintUnknownRuleOptions;
  options: PackagelintUnknownRuleOptions;

  doValidation: (
    options: PackagelintUnknownRuleOptions,
    packagelintContext: PackagelintRuleValidationFnContext,
  ) => PackagelintValidationResult | Promise<PackagelintValidationResult>;
  validationMessages: {
    [language in PackagelintLanguageCode]: {
      [errorName: string]: string;
    };
  };
}
