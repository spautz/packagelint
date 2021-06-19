import {
  PackagelintPreparedConfig,
  PackagelintPreparedRule,
  PackagelintRuleConfig,
  PackagelintRuleDefinition,
  PackagelintRuleEntry,
  PackagelintRuleName,
  PackagelintRulePreparerInstance,
  PackagelintRulesetConfig,
  PackagelintRulesetDefinition,
  PackagelintRulesetEntry,
  PackagelintUserConfig,
  ERROR_LEVEL__ERROR,
  PackagelintInternalException,
  PackagelintRuleDefinitionException,
  PackagelintUserConfigException,
  isValidErrorLevel,
} from '@packagelint/types';

import { isRuleDefinition, isRulesetDefinition } from '../util';
import { resolveRuleOrRuleset } from './resolveRuleOrRuleset';

class DefaultRulePreparer implements Required<PackagelintRulePreparerInstance> {
  _userConfig: PackagelintUserConfig | null = null;
  _ruleOrder: Array<PackagelintRuleName> = [];
  _ruleInfo: Record<PackagelintRuleName, PackagelintPreparedRule> = Object.create(null);

  async prepareUserConfig(userConfig: PackagelintUserConfig): Promise<PackagelintPreparedConfig> {
    if (!userConfig) {
      throw new PackagelintInternalException(
        'RuleValidator.prepareUserConfig() must be given a userConfig',
      );
    }

    this._userConfig = userConfig;

    await this._prepareAllRules();

    const preparedConfig = this._getPreparedConfig();
    return preparedConfig;
  }

  // These exist in the default implementation, but are not part of the API contract used by validatePreparedConfig().
  // These all implicitly use the preparedConfig passed into `validatePreparedConfig`, and will not work standalone.

  async _prepareAllRules(): Promise<Array<PackagelintRuleName>> {
    if (!this._userConfig) {
      throw new PackagelintInternalException('Cannot prepareAllRules when no userConfig is set');
    }

    const allPendingRules = this._userConfig.rules.map((ruleEntry) => {
      return this._processRuleEntry(ruleEntry);
    });
    return await Promise.all(allPendingRules).then(() => this._ruleOrder);
  }

  async _processRuleEntry(
    ruleEntry: PackagelintRuleEntry | PackagelintRulesetEntry,
  ): Promise<PackagelintPreparedRule | Array<PackagelintPreparedRule>> {
    const ruleEntryObject = this._expandRuleEntryIntoConfig(ruleEntry);

    // @TODO: Proper splitting of rule result types
    // @ts-ignore
    const { name, enabled, extendRule, errorLevel, options, resetOptions, messages } =
      ruleEntryObject;

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
            throw new PackagelintRuleDefinitionException(
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
          const allPendingRulesInRuleset: Array<
            Promise<PackagelintPreparedRule | Array<PackagelintPreparedRule>>
          > = baseRule.rules.map((ruleEntry) => {
            return this._processRuleEntry(ruleEntry);
          });
          const allRulesInRuleset = await Promise.all(allPendingRulesInRuleset);
          // Flatten
          const flattedRuledInRuleset: Array<PackagelintPreparedRule> = allRulesInRuleset.reduce<
            Array<PackagelintPreparedRule>
          >((acc, preparedRuleOrList) => {
            if (Array.isArray(preparedRuleOrList)) {
              acc.push(...preparedRuleOrList);
            } else {
              acc.push(preparedRuleOrList);
            }
            return acc;
          }, []);
          return flattedRuledInRuleset;
        } else {
          throw new PackagelintRuleDefinitionException(`Unrecognized config for rule "${name}"`);
        }
      }

      if (initialRule) {
        this._ruleInfo[name] = initialRule;
        this._ruleOrder.push(name);
      }
    } else if (extendRule) {
      throw new PackagelintInternalException('Not implemented: edge cases with extendRule');
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
    return existingConfig;
  }

  _expandRuleEntryIntoConfig(
    ruleEntry: PackagelintRuleEntry | PackagelintRulesetEntry,
  ): PackagelintRuleConfig | PackagelintRulesetConfig {
    if (typeof ruleEntry === 'string') {
      return {
        name: ruleEntry,
        enabled: true,
      };
    }
    if (Array.isArray(ruleEntry)) {
      // @TODO: Validation for length
      const [preparedRuleName, ruleOptions] = ruleEntry;
      if (typeof ruleOptions === 'boolean') {
        return {
          name: preparedRuleName,
          enabled: ruleOptions,
        };
      }
      if (typeof ruleOptions === 'string') {
        if (!isValidErrorLevel(ruleOptions)) {
          throw new PackagelintUserConfigException(
            `Invalid errorLevel "${ruleOptions}" for rule "${preparedRuleName}"`,
          );
        }
        return {
          name: preparedRuleName,
          enabled: true,
          errorLevel: ruleOptions,
        };
      }
      // @TODO: Validation for object type
      return {
        name: preparedRuleName,
        enabled: true,
        options: ruleOptions,
      };
    }

    // @TODO: Validation for object type
    return {
      enabled: true,
      ...ruleEntry,
    };
  }

  async _importRule(
    name: PackagelintRuleName,
  ): Promise<PackagelintRuleDefinition | PackagelintRulesetDefinition> {
    return resolveRuleOrRuleset(name);
  }

  // @TODO
  // async _processRuleConfig(ruleConfig: PackagelintRuleConfig): Promise<PackagelintPreparedRule> {
  //   throw new Error('@TODO');
  // }

  // @TODO
  // async _processRulesetConfig(
  //   rulesetConfig: PackagelintRulesetConfig,
  // ): Promise<Array<PackagelintPreparedRule>> {
  //   throw new Error('@TODO');
  // }

  _getPreparedRuleList(): Array<PackagelintPreparedRule> {
    return this._ruleOrder.map((preparedRuleName) => this._ruleInfo[preparedRuleName]);
  }

  _getPreparedConfig(): PackagelintPreparedConfig {
    if (!this._userConfig) {
      throw new PackagelintInternalException('Cannot getPreparedConfig when no userConfig is set');
    }

    return {
      ...this._userConfig,
      rules: this._getPreparedRuleList(),
      // @FIXME: Need an intermediate typing here, or else to only pass back a ruleList
    } as any as PackagelintPreparedConfig;
  }
}

export { DefaultRulePreparer };
