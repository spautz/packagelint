import {
  PackagelintUserConfig,
  PackagelintProcessedConfig,
  PackagelintProcessedRule,
  PackagelintRuleConfig,
  PackagelintRulesetConfig,
} from '@packagelint/core';

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

  rules.forEach((ruleInfo) => {
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
    addRuleToList(
      {
        name: ruleInfo,
        enabled: true,
      },
      processedRuleList,
      processedRulesByName,
    );
  }
}

/////////////////

processConfig(defaultUserConfig);

processConfig({
  failOnErrorLevel: 'error',
  rules: [
    // `@packagelint/core` defines the rules, but rules are disabled by default:
    // each `@packagelint/recommended-...` ruleset enables a default set of core rules.
    '@packagelint/recommended-library-rules',

    // Update the `nvmrc` rule to require at least Node 14, instead of the default.
    // This could also be written like this, if you prefer shorthand:
    //  ['@packagelint/core/nvmrc', { minVersion: '14' }],
    {
      name: '@packagelint/core/nvmrc',
      options: {
        version: '^14',
      },
    },

    // Update the `npmrc` rule to require `save-exact=true`.
    // You would use a similar approach if your organization requires a specific `registry` to be set in .npmrc
    {
      name: '@packagelint/core/npmrc',
      options: {
        requireValues: {
          'save-exact': 'true',
        },
      },
    },
  ],
});

export { processConfig };
