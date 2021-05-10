import type { PackagelintRulesetDefinition } from '@packagelint/core';

const libraryRulesetDefinition: PackagelintRulesetDefinition = {
  name: 'library',
  docs: {
    description: 'Standard ruleset for a package that publishes a library',
  },
  rules: [
    {
      name: 'library-alias1',
      extendRule: '@packagelint/core:always-fail',
      errorLevel: 'warning',
      options: {
        optionA: true,
      },
    },
    {
      name: '@packagelint/core:always-fail',
      errorLevel: 'error',
      options: {
        optionC: true,
      },
    },
    {
      name: 'library-alias2',
      extendRule: '@packagelint/core:always-fail',
      errorLevel: 'warning',
      options: {
        optionB: true,
      },
    },
  ],
};

export { libraryRulesetDefinition };
