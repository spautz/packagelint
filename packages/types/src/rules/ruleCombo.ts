import { PackagelintRuleEntry } from '../configs/ruleEntry';
import { PackagelintErrorLevel } from '../error-levels/errorLevels';
import { PackagelintValidationResult } from '../results/validationResult';
import { PackagelintLanguageCode } from '../languageCodes';

import {
  PackagelintRuleName,
  PackagelintRuleValidationFnContext,
  PackagelintRuleValidationFnReturn,
  PackagelintUnknownRuleError,
  PackagelintUnknownRuleErrorData,
  PackagelintUnknownRuleOptions,
} from './ruleCheck';

export interface PackagelintRuleComboDefinition<
  OptionsType extends PackagelintUnknownRuleOptions = PackagelintUnknownRuleOptions,
  ErrorNames extends PackagelintUnknownRuleError = PackagelintUnknownRuleError,
  ErrorDataType extends PackagelintUnknownRuleErrorData = PackagelintUnknownRuleErrorData,
> {
  /* Unique identifier for the rulecombo */
  name: PackagelintRuleName;
  /* Human-readable information about the rulecombo */
  docs: {
    url: string;
    [key: string]: string;
  };
  /* Error level for the result, if not overridden or set by each rule. Defaults to "error". */
  defaultErrorLevel: PackagelintErrorLevel;
  /* Options for the rulecombo, if not overridden by its rule entry */
  defaultOptions: OptionsType;
  /* The rules whose results the rulecombo will evaluate */
  ruleInputs:
    | Array<PackagelintRuleEntry>
    | Record<PackagelintRuleName, PackagelintRuleEntry>
    | ((
        options: OptionsType,
      ) => Array<PackagelintRuleEntry> | Record<PackagelintRuleName, PackagelintRuleEntry>);
  /* Function that implements the evaluation. Receives a PackagelintValidationResult for each item in ruleInputs  */
  doEvaluation: PackagelintRuleComboEvaluationFn<OptionsType, ErrorNames, ErrorDataType>;
  /* Human-readable messages for failed combo results, if you don't want to use one from the ruleInputs */
  evaluationMessages: {
    [language in PackagelintLanguageCode]: {
      [key in ErrorNames]: string;
    };
  };
}

export type PackagelintRuleComboEvaluationFn<
  OptionsType extends PackagelintUnknownRuleOptions = PackagelintUnknownRuleOptions,
  ErrorNames extends PackagelintUnknownRuleError = PackagelintUnknownRuleError,
  ErrorDataType extends PackagelintUnknownRuleErrorData = PackagelintUnknownRuleErrorData,
> = (
  ruleInputResults:
    | Array<PackagelintValidationResult>
    | Record<PackagelintRuleName, PackagelintValidationResult>,
  options: OptionsType,
  comboContext: PackagelintComboFnContext<ErrorNames, ErrorDataType>,
) =>
  | PackagelintRuleValidationFnReturn<ErrorNames, ErrorDataType>
  | Promise<PackagelintRuleValidationFnReturn<ErrorNames, ErrorDataType>>;

// A smaller version of PackagelintRuleValidationFnContext which doesn't provide any implementation-time helpers
export type PackagelintComboFnContext<
  ErrorNames extends PackagelintUnknownRuleError = PackagelintUnknownRuleError,
  ErrorDataType extends PackagelintUnknownRuleErrorData = PackagelintUnknownRuleErrorData,
> = Pick<
  PackagelintRuleValidationFnContext<ErrorNames, ErrorDataType>,
  'preparedRuleName' | 'createErrorToReturn' | 'setErrorData'
>;
