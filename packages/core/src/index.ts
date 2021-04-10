import { PackagelintRuleDefinition } from './types';

import { alwaysFailRuleDefinition } from './always-fail/always-fail';
import { nvmrcRuleDefinition } from './nvmrc/nvmrc';

export * from './types';

export * from './always-fail/always-fail';
export * from './nvmrc/nvmrc';

const packagelintRules: Record<string, PackagelintRuleDefinition<any>> = {
  'always-fail': alwaysFailRuleDefinition,
  nvmrc: nvmrcRuleDefinition,
};

export { packagelintRules };
