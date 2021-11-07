import { PackagelintRuleEntry } from '../configs/ruleEntry';
import { PackagelintErrorLevel } from '../error-levels/errorLevels';
import { PackagelintValidationResult } from '../results/validationResult';
import { PackagelintLanguageCode } from '../languageCodes';

import {
  PackagelintRuleName,
  PackagelintRuleCheckValidationFnContext,
  PackagelintRuleCheckValidationFnReturn,
  PackagelintUnknownRuleErrorData,
  PackagelintUnknownRuleOptions,
} from './ruleCheck';

export interface PackagelintRuleComboDefinitionParams {
  OptionsType: PackagelintUnknownRuleOptions;
  ErrorNames: string;
  ErrorData: PackagelintUnknownRuleErrorData | null | undefined;
}

export interface PackagelintRuleComboDefinition<
  RuleComboParams extends PackagelintRuleComboDefinitionParams = PackagelintRuleComboDefinitionParams,
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
  defaultOptions: RuleComboParams['OptionsType'];
  /* The rules whose results the rulecombo will evaluate */
  ruleInputs:
    | Array<PackagelintRuleEntry>
    | Record<PackagelintRuleName, PackagelintRuleEntry>
    | ((
        options: RuleComboParams['OptionsType'],
      ) => Array<PackagelintRuleEntry> | Record<PackagelintRuleName, PackagelintRuleEntry>);
  /* Function that implements the evaluation. Receives a PackagelintValidationResult for each item in ruleInputs  */
  doEvaluation: PackagelintRuleComboEvaluationFn<RuleComboParams>;
  /* Human-readable messages for failed combo results, if you don't want to use one from the ruleInputs */
  evaluationMessages: {
    [language in PackagelintLanguageCode]: {
      [key in RuleComboParams['ErrorNames']]: string;
    };
  };
}

export type PackagelintRuleComboEvaluationFn<
  RuleComboParams extends PackagelintRuleComboDefinitionParams = PackagelintRuleComboDefinitionParams,
> = (
  ruleInputResults:
    | Array<PackagelintValidationResult>
    | Record<PackagelintRuleName, PackagelintValidationResult>,
  options: RuleComboParams['OptionsType'],
  comboContext: PackagelintComboFnContext<RuleComboParams>,
) =>
  | PackagelintRuleCheckValidationFnReturn<RuleComboParams>
  | Promise<PackagelintRuleCheckValidationFnReturn<RuleComboParams>>;

// A smaller version of PackagelintRuleCheckValidationFnContext which doesn't provide any implementation-time helpers
export type PackagelintComboFnContext<
  RuleComboParams extends PackagelintRuleComboDefinitionParams = PackagelintRuleComboDefinitionParams,
> = Pick<
  PackagelintRuleCheckValidationFnContext<RuleComboParams>,
  'preparedRuleName' | 'createErrorToReturn' | 'setErrorData'
>;
