import { PackagelintErrorLevel } from '../error-levels/errorLevels';
import { PackagelintLanguageCode } from '../languageCodes';

export type PackagelintRuleName = string;

export type PackagelintUnknownRuleOptions = Record<string, unknown>;
export type PackagelintUnknownRuleError = string;
export type PackagelintUnknownRuleErrorData = Record<string, unknown> | null | undefined;

export interface PackagelintRuleCheckDefinitionParams {
  OptionsType: PackagelintUnknownRuleOptions;
  ErrorNames: string;
  ErrorData: PackagelintUnknownRuleErrorData | null | undefined;
}

/**
 * The underlying implementation of a rule. This gets combined with a RuleEntryConfig to form a PreparedRule.
 */
export interface PackagelintRuleCheckDefinition<
  RuleCheckParams extends PackagelintRuleCheckDefinitionParams = PackagelintRuleCheckDefinitionParams,
> {
  /* Unique identifier for the rule */
  name: PackagelintRuleName;
  /* Human-readable information about the rule */
  docs: {
    url: string;
    [key: string]: string;
  };
  /* Whether the rule may be used directly, or whether it must first be extended to define a different rule. This is
   * used for generic rules that don't have a fixed semantic meaning and should instead be used by other rules
   * with different options, like `file-exists` or `boolean-and` */
  isAbstract?: boolean;
  /* Error level for the rule, if not overridden by the user config or a ruleset. Defaults to "error". */
  defaultErrorLevel?: PackagelintErrorLevel;
  /* Options for the rule, if not overridden by its rule entry */
  defaultOptions: RuleCheckParams['OptionsType'];
  /* Function that implements the rule's checks */
  doValidation: PackagelintRuleCheckValidationFn<RuleCheckParams>;
  /* Human-readable messages for failed validate results */
  validationMessages: Partial<{
    [language in PackagelintLanguageCode]: Partial<{
      [key in RuleCheckParams['ErrorNames']]: string;
    }>;
  }>;
}

export type PackagelintRuleCheckValidationFn<
  RuleCheckParams extends PackagelintRuleCheckDefinitionParams = PackagelintRuleCheckDefinitionParams,
> = (
  options: RuleCheckParams['OptionsType'],
  ruleContext: PackagelintRuleCheckValidationFnContext<RuleCheckParams>,
) =>
  | PackagelintRuleCheckValidationFnReturn<RuleCheckParams>
  | Promise<PackagelintRuleCheckValidationFnReturn<RuleCheckParams>>;

/**
 * Raw value that a validation function must return
 */
export type PackagelintRuleCheckValidationFnReturn<
  RuleCheckParams extends PackagelintRuleCheckDefinitionParams = PackagelintRuleCheckDefinitionParams,
> = [RuleCheckParams['ErrorNames'], RuleCheckParams['ErrorData']] | null;

/**
 * Helpers and extra info passed into the validation function
 */
export type PackagelintRuleCheckValidationFnContext<
  RuleCheckParams extends PackagelintRuleCheckDefinitionParams = PackagelintRuleCheckDefinitionParams,
> = {
  // General information
  preparedRuleName: string;

  // Helpers so that rules don't have to implement everything themselves
  findFileUp: (fileGlob: string) => Promise<null | Array<string>>;

  // Setting errorData and returning errors
  createErrorToReturn: (
    errorName: RuleCheckParams['ErrorNames'],
    extraErrorData?: RuleCheckParams['ErrorData'],
  ) => PackagelintRuleCheckValidationFnReturn<RuleCheckParams>;
  setErrorData: (errorData: Partial<RuleCheckParams['ErrorData']>) => void;
};
