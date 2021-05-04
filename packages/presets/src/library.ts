import type { PackagelintRulesetDefinition } from '@packagelint/types';

const libraryRulesetDefinition: PackagelintRulesetDefinition = {
  name: 'library',
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
