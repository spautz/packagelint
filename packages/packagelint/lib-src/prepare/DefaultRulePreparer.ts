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
} from '@packagelint/core';
import { PackageLintInternalError } from '../util';

class DefaultRulePreparer implements Required<PackagelintRulePreparerInstance> {
  _userConfig: PackagelintUserConfig | null = null;
  _ruleOrder: Array<PackagelintRuleName> = [];
  _ruleInfo: Record<PackagelintRuleName, PackagelintPreparedRule> = Object.create(null);

  async prepareUserConfig(userConfig: PackagelintUserConfig): Promise<PackagelintPreparedConfig> {
    if (!userConfig) {
      throw new PackageLintInternalError(
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
      throw new PackageLintInternalError('Cannot prepareAllRules when no userConfig is set');
    }

    return await Promise.all(
      this._userConfig.rules.map((ruleEntry) => {
        return this._processRuleEntry(ruleEntry);
      }),
    ).then(() => this._ruleOrder);
  }

  // @TODO: Maybe promote this to a required/supported helper, to allow async buildup of rules when using API?
  async _processRuleEntry(
    _ruleEntry: PackagelintRuleEntry | PackagelintRulesetEntry,
  ): Promise<PackagelintPreparedRule | Array<PackagelintPreparedRule>> {
    throw new Error('@TODO');
  }

  async _importRule(
    _name: PackagelintRuleName,
  ): Promise<PackagelintRuleDefinition | PackagelintRulesetDefinition> {
    throw new Error('@TODO');
  }

  async _processRuleConfig(_ruleConfig: PackagelintRuleConfig): Promise<PackagelintPreparedRule> {
    throw new Error('@TODO');
  }

  async _processRulesetConfig(
    _rulesetConfig: PackagelintRulesetConfig,
  ): Promise<Array<PackagelintPreparedRule>> {
    throw new Error('@TODO');
  }

  _getPreparedRuleList(): Array<PackagelintPreparedRule> {
    return this._ruleOrder.map((preparedRuleName) => this._ruleInfo[preparedRuleName]);
  }

  _getPreparedConfig(): PackagelintPreparedConfig {
    if (!this._userConfig) {
      throw new PackageLintInternalError('Cannot getPreparedConfig when no userConfig is set');
    }

    return {
      ...this._userConfig,
      rules: this._getPreparedRuleList(),
      // @FIXME: Need an intermediate typing here, or else to only pass back a ruleList
    } as any as PackagelintPreparedConfig;
  }
}

export { DefaultRulePreparer };
