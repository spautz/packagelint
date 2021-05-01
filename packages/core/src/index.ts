import { alwaysFailRuleDefinition } from './always-fail/always-fail';
import { nvmrcRuleDefinition } from './nvmrc/nvmrc';

export * from './types';

export * from './always-fail/always-fail';
export * from './nvmrc/nvmrc';

const packagelintExports = {
  'always-fail': alwaysFailRuleDefinition,
  nvmrc: nvmrcRuleDefinition,
};

export { packagelintExports };
