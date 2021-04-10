import { PackagelintRulesetDefinition } from '@packagelint/core';

import { libraryRulesetDefinition } from './library';

export * from './library';

const packagelintRulesets: Record<string, PackagelintRulesetDefinition> = {
  library: libraryRulesetDefinition,
};

export { packagelintRulesets };
