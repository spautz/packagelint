import { PackagelintErrorLevel } from '../error-levels/errorLevels';
import { PackagelintRulePreparerConstructor } from '../internals/rulePreparer';
import { PackagelintRuleValidatorConstructor } from '../internals/ruleValidator';
import {
  PackagelintReporterName,
  PackagelintUnknownReporterOptions,
} from '../reporters/reporterInstance';
import { PackagelintLanguageCode } from '../languageCodes';

import { PackagelintRuleEntry } from './ruleEntry';

/**
 * An unprocessed config, usually from a .packagelintrc file (after merging with defaults). This drives everything
 * about Packagelint: nothing will be loaded or evaluated unless it's specified here, either directly or indirectly.
 */
export interface PackagelintUserConfig {
  // Common options
  /** Controls the exit code of the `packagelint` cli: it will exit 1 if any rule fails at or above the specified level */
  failOnErrorLevel: PackagelintErrorLevel;
  /** The rules and rulesets to run, specified as config objects or in shorthand. */
  rules: Array<PackagelintRuleEntry>;
  /** Result reporters and their configs, keyed by name */
  reporters: Record<PackagelintReporterName, PackagelintUnknownReporterOptions>;
  /** Rules can supply error messages in multiple languages: this changes the preferred language */
  language: PackagelintLanguageCode;

  // Uncommon options
  /** A set of module names, module+rule names, or regular expressions which restricts which modules and rules are
   * allowed. Useful to restrict Packagelint to only use rules from certain sources */
  moduleAllowList: Array<string | RegExp>;
  /** A set of module names, module+rule names, or regular expressions for prohibiting certain modules and rules,
   * even if moduleAllowList would allow them. Useful to restrict Packagelint to only use rules from certain sources */
  moduleDenyList: Array<string | RegExp>;
  /** If something tries to resolve a module, rule, or ruleset which moduleAllowList does not permit, it will be
   * treated as this errorLevel. Defaults to 'exception' */
  moduleAllowListErrorLevel: PackagelintErrorLevel;
  /** If something tries to resolve a module, rule, or ruleset which moduleDenyList prohibits, it will be
   * treated as this errorLevel. Defaults to 'exception' */
  moduleDenyListErrorLevel: PackagelintErrorLevel;
  /** Maps a module or rule name to another. Useful for replacing a rule's implementation */
  ruleAliases: Record<string, string>;
  /** Maps a module or reporter name to another. Useful for replacing a reporter's implementation */
  reporterAliases: Record<string, string>;

  // Danger zone
  /** Internal implementation, for forking or hotfixing. Do not touch unless you're sure of what you're doing. */
  _RulePreparer: PackagelintRulePreparerConstructor;
  /** Internal implementation, for forking or hotfixing. Do not touch unless you're sure of what you're doing. */
  _RuleValidator: PackagelintRuleValidatorConstructor;
}
