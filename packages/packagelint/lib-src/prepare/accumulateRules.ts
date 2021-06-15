import {
  PackagelintPreparedRule,
  PackagelintRuleEntry,
  PackagelintRuleConfig,
  PackagelintRuleDefinition,
  PackagelintRuleName,
  PackagelintRulesetEntry,
  PackagelintRulesetConfig,
  PackagelintRulesetDefinition,
  PackagelintUserConfig,
} from '@packagelint/core';

import {
  ERROR_LEVEL__ERROR,
  PackageLintRuleValidator_RuleConfigError,
  PackageLintRuleValidator_UserConfigError,
  isValidErrorLevel,
} from '../util';
import { resolveRuleOrRuleset } from './resolveRuleOrRuleset';

/**
 * Iterates through a list of user-specified rules and rulesets, resolving each and merging options to make a final list
 * of validation-ready rules.
 */
async function accumulateRules(
  packagelintConfig: PackagelintUserConfig,
): Promise<Array<PackagelintPreparedRule>> {
  const accumulator = new RuleAccumulator();

  await accumulator.accumulateRuleList(packagelintConfig.rules);

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
    ruleList: Array<PackagelintRuleEntry | PackagelintRulesetEntry>,
    overrides?: Partial<PackagelintRuleConfig>,
  ): Promise<void> {
    const allPendingRules = ruleList.map(
      (ruleInfo: PackagelintRuleEntry | PackagelintRulesetEntry) => {
        return this.accumulateRule(ruleInfo, overrides);
      },
    );
    return Promise.all(allPendingRules).then();
  }

  /**
   * @TODO
   */
  accumulateRule(
    ruleInfo: PackagelintRuleEntry | PackagelintRulesetEntry,
    overrides: Partial<PackagelintRuleConfig> = {},
  ): Promise<void> {
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
      const [preparedRuleName, ruleOptions] = ruleInfo;
      if (typeof ruleOptions === 'boolean') {
        return this._accumulateRuleConfigObject({
          ...overrides,
          name: preparedRuleName,
          enabled: ruleOptions,
        });
      }
      if (typeof ruleOptions === 'string') {
        if (!isValidErrorLevel(ruleOptions)) {
          throw new PackageLintRuleValidator_UserConfigError(
            `Invalid errorLevel "${ruleOptions}" for rule "${preparedRuleName}"`,
          );
        }

        return this._accumulateRuleConfigObject({
          ...overrides,
          name: preparedRuleName,
          enabled: true,
          errorLevel: ruleOptions,
        });
      }
      // @TODO: Validation for object type
      return this._accumulateRuleConfigObject({
        ...overrides,
        name: preparedRuleName,
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
    return this._ruleOrder.map((preparedRuleName) => this._ruleInfo[preparedRuleName]);
  }

  async _accumulateRuleConfigObject(
    ruleInfo: PackagelintRuleConfig | PackagelintRulesetConfig,
  ): Promise<void> {
    const { name, enabled, extendRule, errorLevel, options, resetOptions, messages } =
      ruleInfo as PackagelintRuleConfig;

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
          preparedRuleName: name,
          extendedFrom: extendRule,
        };
      } else {
        const baseRule = await resolveRuleOrRuleset(extendRule || name);

        // @TODO: Split between single rules and rulesets

        if (isRuleDefinition(baseRule)) {
          if (name === baseRule.name && baseRule.isAbstract) {
            throw new PackageLintRuleValidator_RuleConfigError(
              `Rule "${name}" is abstract: make a new rule (extendRule) instead of using it directly`,
            );
          }

          const initialErrorLevel = baseRule.defaultErrorLevel || ERROR_LEVEL__ERROR;
          const initialOptions = baseRule.defaultOptions || {};

          initialRule = {
            preparedRuleName: name,
            docs: baseRule.docs,
            enabled: false,
            extendedFrom: extendRule || null,
            defaultErrorLevel: initialErrorLevel,
            errorLevel: initialErrorLevel,
            defaultOptions: initialOptions,
            options: initialOptions,
            messages: baseRule.messages,
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

function isRuleDefinition(ruleInfo: unknown): ruleInfo is PackagelintRuleDefinition {
  // @TODO: Proper validation
  // @ts-ignore
  return !!ruleInfo?.doValidation;
}

function isRulesetDefinition(ruleInfo: unknown): ruleInfo is PackagelintRulesetDefinition {
  // @TODO: Proper validation
  // @ts-ignore
  return !!ruleInfo?.rules;
}

export { accumulateRules, RuleAccumulator, isRuleDefinition, isRulesetDefinition };
