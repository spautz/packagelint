import { PackagelintRuleDefinition, PackagelintOutputConstructor } from './types';

import { alwaysFailRuleDefinition } from './rules/always-fail/always-fail';
import { nvmrcRuleDefinition } from './rules/nvmrc/nvmrc';

import { InternalDebugOutput } from './outputs/internalDebugOutput/InternalDebugOutput';

export * from './types';

export * from './rules/always-fail/always-fail';
export * from './rules/nvmrc/nvmrc';

export * from './outputs/internalDebugOutput/InternalDebugOutput';

const packagelintRules: Record<string, PackagelintRuleDefinition<any>> = {
  'always-fail': alwaysFailRuleDefinition,
  nvmrc: nvmrcRuleDefinition,
};

const packagelintOutputs: Record<string, PackagelintOutputConstructor<any>> = {
  internalDebug: InternalDebugOutput,
};

export { packagelintRules, packagelintOutputs };
