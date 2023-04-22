import { PackagelintErrorLevel } from '../error-levels/errorLevels';
import { PackagelintRuleName, PackagelintUnknownRuleOptions } from '../rules/ruleCheck';

/**
 * When a rule is listed in the UserConfig or in a RuleSetDefinition, it may be given in shorthand:
 *  - A simple string will enable the rule, with its default options
 *  - An array with a boolean will enable or disable the rule, with its default options
 *  - An array with a string will enable the rule, with its default options, and set its errorLevel
 *  - An array with an object will enable the rule and set its options
 *  - A full object allows you to customize options, errorLevel, and whatever other settings you wish
 */
export type PackagelintRuleEntry =
  /** A string: enable the rule */
  | PackagelintRuleName
  /** String & boolean: enable or disable the rule */
  | [PackagelintRuleName, boolean]
  /** String & string: enable the rule at the given errorLevel */
  | [PackagelintRuleName, PackagelintErrorLevel]
  /** String & object: enable the rule with the given options */
  | [PackagelintRuleName, PackagelintUnknownRuleOptions]
  /** Object: a full PackagelintRuleConfig, see below */
  | PackagelintRuleEntryConfig;

// Each PackagelintRuleEntry is expanded into a PackagelintRuleConfig

/**
 * An unresolved, unprocessed reference to a rulecheck, rulecombo, or ruleset
 */
export type PackagelintRuleEntryConfig = {
  /** The rule's unique identifier. If this matches an existing Rule then it will merge these settings over its
   * current or default config. If it is a new, unrecognized name then `extendRule` must be specified. */
  name: PackagelintRuleName;
  /** Whether or not to run the rule during validation */
  enabled?: boolean;
  /** Used when making a new rule name which extends from an existing one, to give it its own options or a different
   * errorLevel. Its implementation and default options will be copied from the base rule name.
   * `name` must be a new, unrecognized value to do this. */
  extendRule?: PackagelintRuleName;
  /** If the rule fails, the errorLevel that its failure is reported as */
  errorLevel?: PackagelintErrorLevel;
  /** Rule-specific options */
  options?: PackagelintUnknownRuleOptions;
  /** When making a new copy of a rule via `extendRule`, this controls whether the base rule's current options are
   *  used, or whether its original defaultOptions are used. */
  resetOptions?: boolean;
  /** Override or expand error messages, e.g. for different languages */
  validationMessages: {
    [language: string]: {
      [key: string]: string;
    };
  };
};
