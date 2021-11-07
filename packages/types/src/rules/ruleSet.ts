import { PackagelintRuleEntry } from '../configs/ruleEntry';
import { PackagelintErrorLevel } from '../error-levels/errorLevels';

import { PackagelintRuleName, PackagelintUnknownRuleOptions } from './ruleCheck';

/**
 * Registers the implementation of a RuleSet
 *
 * `rules` will be expanded during rule preparation
 */
export interface PackagelintRuleSetDefinition<
  OptionsType extends PackagelintUnknownRuleOptions = PackagelintUnknownRuleOptions,
> {
  /* Unique identifier for the ruleset */
  name: PackagelintRuleName;
  /* Human-readable information about the ruleset */
  docs: {
    url: string;
    [key: string]: string;
  };
  /* Error level for all rules, if not overridden or set by each rule. Defaults to "error". */
  defaultErrorLevel: PackagelintErrorLevel;
  /* Options for the ruleset, if not overridden by its rule entry */
  defaultOptions: OptionsType;
  /* The rulechecks, rulesets, and rulecombos to run for this ruleset */
  rules: Array<PackagelintRuleEntry> | ((options: OptionsType) => Array<PackagelintRuleEntry>);
}
