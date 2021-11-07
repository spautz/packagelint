import { PackagelintErrorLevel } from '../error-levels/errorLevels';
import { PackagelintLanguageCode } from '../languageCodes';

export type PackagelintRuleName = string;

export type PackagelintUnknownRuleOptions = Record<string, unknown>;
export type PackagelintUnknownRuleError = string;
export type PackagelintUnknownRuleErrorData = Record<string, unknown> | null | undefined;

/**
 * The underlying implementation of a rule. This gets combined with a RuleEntryConfig to form a PreparedRule.
 */
export interface PackagelintRuleCheckDefinition<
  OptionsType extends PackagelintUnknownRuleOptions = PackagelintUnknownRuleOptions,
  ErrorNames extends PackagelintUnknownRuleError = PackagelintUnknownRuleError,
  ErrorDataType extends PackagelintUnknownRuleErrorData = PackagelintUnknownRuleErrorData,
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
  isAbstract: boolean;
  /* Error level for the rule, if not overridden by the user config or a ruleset. Defaults to "error". */
  defaultErrorLevel: PackagelintErrorLevel;
  /* Options for the rule, if not overridden by its rule entry */
  defaultOptions: OptionsType;
  /* Function that implements the rule's checks */
  doValidation: PackagelintRuleValidationFn<OptionsType, ErrorNames, ErrorDataType>;
  /* Human-readable messages for failed validate results */
  validationMessages: {
    [language in PackagelintLanguageCode]: {
      [key in ErrorNames]: string;
    };
  };
}

export type PackagelintRuleValidationFn<
  OptionsType extends PackagelintUnknownRuleOptions = PackagelintUnknownRuleOptions,
  ErrorNames extends PackagelintUnknownRuleError = PackagelintUnknownRuleError,
  ErrorDataType extends PackagelintUnknownRuleErrorData = PackagelintUnknownRuleErrorData,
> = (
  options: OptionsType,
  ruleContext: PackagelintRuleValidationFnContext<ErrorNames, ErrorDataType>,
) =>
  | PackagelintRuleValidationFnReturn<ErrorNames, ErrorDataType>
  | Promise<PackagelintRuleValidationFnReturn<ErrorNames, ErrorDataType>>;

/**
 * Raw value that a validation function must return
 */
export type PackagelintRuleValidationFnReturn<
  ErrorNames extends PackagelintUnknownRuleError = PackagelintUnknownRuleError,
  ErrorDataType extends PackagelintUnknownRuleErrorData = PackagelintUnknownRuleErrorData,
> = [ErrorNames, ErrorDataType] | null;

/**
 * Helpers and extra info passed into the validation function
 */
export type PackagelintRuleValidationFnContext<
  ErrorNames extends PackagelintUnknownRuleError = PackagelintUnknownRuleError,
  ErrorDataType extends PackagelintUnknownRuleErrorData = PackagelintUnknownRuleErrorData,
> = {
  // General information
  preparedRuleName: string;

  // Helpers so that rules don't have to implement everything themselves
  // @TODO:
  // findFileUp: (fileGlob: string) => Promise<null | Array<string>>;

  // Setting errorData and returning errors
  createErrorToReturn: (
    errorName: ErrorNames,
    extraErrorData?: ErrorDataType,
  ) => [ErrorNames, ErrorDataType];
  setErrorData: (errorData: ErrorDataType) => void;
};
