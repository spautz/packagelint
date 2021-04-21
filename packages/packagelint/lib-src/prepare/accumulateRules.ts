import {
  PackagelintPreparedRule,
  PackagelintRuleConfig,
  PackagelintRuleConfigObject,
  PackagelintRuleDefinition,
  PackagelintRuleName,
  PackagelintRulesetConfig,
  PackagelintRulesetConfigObject,
  PackagelintRulesetDefinition,
} from '@packagelint/core';

import { resolveRule } from './resolveRule';
import { ERROR_LEVEL__ERROR } from '../validate/errorLevels';

/**
 * Iterates through a list of user-specified rules and rulesets, resolving each and merging options to make a final list
 * of validation-ready rules.
 */
function accumulateRules(
  rawRuleList: Array<PackagelintRuleConfig | PackagelintRulesetConfig>,
): Array<PackagelintPreparedRule> {
  const accumulator = new RuleAccumulator();

  accumulator.accumulateRuleList(rawRuleList);

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
  accumulateRuleList(
    ruleList: Array<PackagelintRuleConfig | PackagelintRulesetConfig>,
    overrides?: Partial<PackagelintRuleConfigObject>,
  ): void {
    ruleList.forEach((ruleInfo: PackagelintRuleConfig | PackagelintRulesetConfig) => {
      this.accumulateRule(ruleInfo, overrides);
    });
  }

  /**
   * @TODO
   */
  accumulateRule(
    ruleInfo: PackagelintRuleConfig | PackagelintRulesetConfig,
    overrides: Partial<PackagelintRuleConfigObject> = {},
  ): void {
    // Shorthands
    if (typeof ruleInfo === 'string') {
      return this._accumulateRuleConfigObject({
        ...overrides,
        name: ruleInfo,
        enabled: true,
      });
    }
    if (Array.isArray(ruleInfo)) {
      // @TODO: Validation for length
      const [ruleName, ruleOptions] = ruleInfo;
      if (typeof ruleOptions === 'boolean') {
        return this._accumulateRuleConfigObject({
          ...overrides,
          name: ruleName,
          enabled: ruleOptions,
        });
      }
      // @TODO: Validation for object type
      return this._accumulateRuleConfigObject({
        ...overrides,
        name: ruleName,
        enabled: true,
        options: ruleOptions,
      });
    }

    // @TODO: Validation for object type
    return this._accumulateRuleConfigObject({
      ...overrides,
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
    const {
      name,
      enabled,
      extendRule,
      errorLevel,
      options,
      resetOptions,
      messages,
    } = ruleInfo as PackagelintRuleConfigObject;

    if (!this._ruleInfo[name]) {
      // We haven't seen this rule before: it's either a bulk modification, or we need to populate its base state
      // before we apply the options/enabled/etc from above
      let initialRule: PackagelintPreparedRule | null = null;

      // @TODO: rulesets
      // @TODO: self-implemented rules
      // @TODO: wildcards

      if (extendRule && this._ruleInfo[extendRule]) {
        initialRule = {
          ...this._ruleInfo[extendRule],
          ruleName: name,
          extendedFrom: extendRule,
        };
      } else {
        const baseRule = resolveRule(extendRule || name);

        // @TODO: Split between single rules and rulesets

        if (isRuleDefinition(baseRule)) {
          if (name === baseRule.name && baseRule.isAbstract) {
            throw new Error(
              `Rule "${name}" is abstract: make a new rule (extendRule) instead of using it directly`,
            );
          }

          initialRule = {
            ruleName: name,
            docs: baseRule.docs,
            enabled: false,
            extendedFrom: extendRule || null,
            errorLevel: baseRule.defaultErrorLevel || ERROR_LEVEL__ERROR,
            defaultOptions: baseRule.defaultOptions || {},
            options: baseRule.defaultOptions || {},
            messages: baseRule.messages || {},
            doValidation: baseRule.doValidation,
          };
        } else if (isRulesetDefinition(baseRule)) {
          // @TODO: Apply ruleset-wide options like errorLevel
          return this.accumulateRuleList(baseRule.rules, {});
        } else {
          throw new Error(`Unrecognized config for rule "${name}"`);
        }
      }

      if (initialRule) {
        this._ruleInfo[name] = initialRule;
        this._ruleOrder.push(name);
      }
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
    if (resetOptions) {
      existingConfig.options = { ...existingConfig.defaultOptions };
    }
    if (options) {
      existingConfig.options = { ...existingConfig.options, ...options };
    }
    if (messages) {
      existingConfig.messages = { ...existingConfig.messages, ...messages };
    }
  }
}

function isRuleDefinition(ruleInfo: any): ruleInfo is PackagelintRuleDefinition {
  // @TODO: Proper validation
  return !!ruleInfo.doValidation;
}

function isRulesetDefinition(ruleInfo: any): ruleInfo is PackagelintRulesetDefinition {
  // @TODO: Proper validation
  return !!ruleInfo.rules;
}

export { accumulateRules, RuleAccumulator, isRuleDefinition };