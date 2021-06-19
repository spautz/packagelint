import { PackagelintRuleDefinition, PackagelintReporterConstructor } from '@packagelint/types';

import { alwaysFailRuleDefinition } from './rules/always-fail/always-fail';
import { alwaysPassRuleDefinition } from './rules/always-pass/always-pass';
import { alwaysThrowRuleDefinition } from './rules/always-throw/always-throw';
import { nvmrcRuleDefinition } from './rules/nvmrc/nvmrc';

import { InternalDebugReporter } from './reporters/internalDebugReporter/InternalDebugReporter';

export * from './rules/always-fail/always-fail';
export * from './rules/always-pass/always-pass';
export * from './rules/always-throw/always-throw';
export * from './rules/nvmrc/nvmrc';

export * from './reporters/internalDebugReporter/InternalDebugReporter';

const packagelintRules: Record<string, PackagelintRuleDefinition<any>> = {
  'always-fail': alwaysFailRuleDefinition,
  'always-pass': alwaysPassRuleDefinition,
  'always-throw': alwaysThrowRuleDefinition,
  nvmrc: nvmrcRuleDefinition,
};

const packagelintReporters: Record<string, PackagelintReporterConstructor<any>> = {
  internalDebugReporter: InternalDebugReporter,
};

export { packagelintRules, packagelintReporters };
