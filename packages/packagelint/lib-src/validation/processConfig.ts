import {
  PackagelintUserConfig,
  PackagelintProcessedConfig,
  PackagelintProcessedRule,
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
 * Expands, flattens, and resolves a User Config into a flat list of validation rules
 */
function processConfig(actualProjectConfig: PackagelintUserConfig): PackagelintProcessedConfig {
  const userConfig = {
    ...defaultUserConfig,
    ...actualProjectConfig,
  };

  const { rules } = userConfig;
  console.log('raw rules = ', rules);

  const newRuleList: Array<PackagelintProcessedRule> = [];
  const rulesByName: Record<string, PackagelintProcessedRule> = Object.create(null);

  rules.forEach((ruleInfo: PackagelintRuleConfig | PackagelintRulesetConfig) => {
    addRuleToList(ruleInfo, newRuleList, rulesByName);
  });

  return {
    ...userConfig,
    rules: newRuleList,
  };
}

/**
 * This mutates processedRuleList and processedRulesByName
 */
function addRuleToList(
  ruleInfo: PackagelintRuleConfig | PackagelintRulesetConfig,
  processedRuleList: Array<PackagelintProcessedRule>,
  processedRulesByName: Record<string, PackagelintProcessedRule>,
): void {
  if (typeof ruleInfo === 'string') {
    return addRuleToList(
      {
        name: ruleInfo,
        enabled: true,
      },
      processedRuleList,
      processedRulesByName,
    );
  }
  if (Array.isArray(ruleInfo)) {
    return addRuleToList(
      {
        name: ruleInfo[0],
        enabled: true,
        options: ruleInfo[1],
      },
      processedRuleList,
      processedRulesByName,
    );
  }

  const { name } = ruleInfo;

  const resolvedRule = resolveRule(name);
  // @TODO: Add/merge configs and options
  // if (processedRulesByName[name]) {
  //
  // }

  // @ts-ignore
  processedRuleList.push(resolvedRule);
}

export { processConfig };
