import { PackagelintRuleDefinition, PackagelintReporterConstructor } from './types';

import { alwaysFailRuleDefinition } from './rules/always-fail/always-fail';
import { alwaysPassRuleDefinition } from './rules/always-pass/always-pass';
import { nvmrcRuleDefinition } from './rules/nvmrc/nvmrc';

import { InternalDebugReporter } from './reporters/internalDebugReporter/InternalDebugReporter';

export * from './types';

export * from './rules/always-fail/always-fail';
export * from './rules/always-pass/always-pass';
export * from './rules/nvmrc/nvmrc';

export * from './reporters/internalDebugReporter/InternalDebugReporter';

const packagelintRules: Record<string, PackagelintRuleDefinition<any>> = {
  'always-fail': alwaysFailRuleDefinition,
  'always-pass': alwaysPassRuleDefinition,
  nvmrc: nvmrcRuleDefinition,
};

const packagelintReporters: Record<string, PackagelintReporterConstructor<any>> = {
  internalDebugReporter: InternalDebugReporter,
};

export { packagelintRules, packagelintReporters };
