import { alwaysFailRuleDefinition } from './rules/always-fail/always-fail';
import { nvmrcRuleDefinition } from './rules/nvmrc/nvmrc';

export * from './types';

export * from './rules/always-fail/always-fail';
export * from './rules/nvmrc/nvmrc';

const packagelintRules = {
  'always-fail': alwaysFailRuleDefinition,
  nvmrc: nvmrcRuleDefinition,
};

export { packagelintRules };
