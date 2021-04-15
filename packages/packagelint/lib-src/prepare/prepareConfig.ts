import {
  PackagelintUserConfig,
  PackagelintPreparedConfig,
  PackagelintPreparedRule,
  PackagelintRuleConfig,
  PackagelintRulesetConfig,
} from '@packagelint/core';
import { resolveRule } from './resolveRule';

const defaultUserConfig: PackagelintUserConfig = {
  failOnErrorLevel: 'error',
  rules: [
    {
      name: '@packagelint/core/always-fail',
      options: {
        message: 'You must define packagelint rules in your config',
      },
    },
  ],
};

/**
 * Expands, flattens, and resolves a User Config into a flat list of validate rules
 */
function prepareConfig(actualProjectConfig: PackagelintUserConfig): PackagelintPreparedConfig {
  const userConfig = {
    ...defaultUserConfig,
    ...actualProjectConfig,
  };

  const { rules } = userConfig;
  console.log('raw rules = ', rules);

  const newRuleList: Array<PackagelintPreparedRule> = [];
  const rulesByName: Record<string, PackagelintPreparedRule> = Object.create(null);

  rules.forEach((ruleInfo: PackagelintRuleConfig | PackagelintRulesetConfig) => {
    addRuleToList(ruleInfo, newRuleList, rulesByName);
  });

  return {
    ...userConfig,
    rules: newRuleList,
  };
}

/**
 * This mutates preparedRuleList and preparedRulesByName
 */
function addRuleToList(
  ruleInfo: PackagelintRuleConfig | PackagelintRulesetConfig,
  preparedRuleList: Array<PackagelintPreparedRule>,
  preparedRulesByName: Record<string, PackagelintPreparedRule>,
): void {
  if (typeof ruleInfo === 'string') {
    return addRuleToList(
      {
        name: ruleInfo,
        enabled: true,
      },
      preparedRuleList,
      preparedRulesByName,
    );
  }
  if (Array.isArray(ruleInfo)) {
    return addRuleToList(
      {
        name: ruleInfo[0],
        enabled: true,
        options: ruleInfo[1],
      },
      preparedRuleList,
      preparedRulesByName,
    );
  }

  const { name } = ruleInfo;

  const resolvedRule = resolveRule(name);
  // @TODO: Add/merge configs and options
  // if (preparedRulesByName[name]) {
  //
  // }

  // @ts-ignore
  preparedRuleList.push(resolvedRule);
}

export { prepareConfig };
