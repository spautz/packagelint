import {
  PackagelintPreparedRule,
  PackagelintRuleConfig,
  PackagelintRulesetConfig,
  PackagelintRuleName,
  PackagelintRuleConfigObject,
  PackagelintRulesetConfigObject,
} from '@packagelint/core';

import { resolveRule } from './resolveRule';

/**
 * Iterates through a list of user-specified rules and rulesets, resolving each and merging options to make a final list
 * of validation-ready rules.
 */
function accumulateRules(
  rawRuleList: Array<PackagelintRuleConfig | PackagelintRulesetConfig>,
): Array<PackagelintPreparedRule> {
  const accumulator = new RuleAccumulator();

  rawRuleList.forEach((ruleInfo: PackagelintRuleConfig | PackagelintRulesetConfig) => {
    accumulator.accumulateRule(ruleInfo);
  });

  return accumulator.getPreparedRuleList();
}

class RuleAccumulator {
  _ruleOrder: Array<PackagelintRuleName>;
  _ruleInfo: Record<PackagelintRuleName, PackagelintPreparedRule>;

  constructor() {
    this._ruleOrder = [];
    this._ruleInfo = Object.create(null);
  }

  /**
   * @TODO
   */
  accumulateRule(ruleInfo: PackagelintRuleConfig | PackagelintRulesetConfig): void {
    // Shorthands
    if (typeof ruleInfo === 'string') {
      return this._accumulateRuleConfigObject({
        name: ruleInfo,
        enabled: true,
      });
    }
    if (Array.isArray(ruleInfo)) {
      // @TODO: Validation for length
      const [ruleName, ruleOptions] = ruleInfo;
      if (typeof ruleOptions === 'boolean') {
        return this._accumulateRuleConfigObject({
          name: ruleName,
          enabled: ruleOptions,
        });
      }
      // @TODO: Validation for object type
      return this._accumulateRuleConfigObject({
        name: ruleName,
        enabled: true,
        options: ruleOptions,
      });
    }

    // @TODO: Validation for object type
    return this._accumulateRuleConfigObject({
      enabled: true,
      ...ruleInfo,
    });
  }

  /**
   * @TODO
   */
  getPreparedRuleList(): Array<PackagelintPreparedRule> {
    return this._ruleOrder.map((ruleName) => this._ruleInfo[ruleName]);
  }

  _accumulateRuleConfigObject(
    ruleInfo: PackagelintRuleConfigObject | PackagelintRulesetConfigObject,
  ): void {
    // @ts-ignore
    const { name, enabled, extendRule, errorLevel, options, messages } = ruleInfo;

    if (!this._ruleInfo[name]) {
      // We haven't seen this rule before: initialize its config
      const resolvedRule = resolveRule(extendRule || name);

      // @TODO: Handle rulesets

      // @ts-ignore
      this._ruleInfo[name] = {
        ...resolvedRule,
        ruleName: name,
      };
      this._ruleOrder.push(name);
    } else if (extendRule) {
      throw new Error('Not implemented: edge cases with extendRule');
      // @TODO: Handle edge cases with extendRule:
      //  - Different entries declaring different extendRules
      //  - A real rule matching the user-selected name, within the same package
      //  - Late resolution, in case an early rule extends a user-selected rule name
    }

    // Now apply the incoming config
    // We mutate because we created this config ourselves
    const existingConfig = this._ruleInfo[name];
    if (enabled != null) {
      existingConfig.enabled = enabled;
    }
    if (errorLevel != null) {
      existingConfig.errorLevel = errorLevel;
    }
    if (options) {
      existingConfig.options = { ...(existingConfig.options || {}), options };
    }
    if (messages) {
      existingConfig.messages = { ...(existingConfig.messages || {}), messages };
    }
  }
}

export { accumulateRules, RuleAccumulator };
