import {
  PackagelintReporterConstructor,
  PackagelintRuleDefinition,
  checkPackagelintExports,
} from '@packagelint/types';

import { InternalDebugReporter } from './reporters';
import {
  alwaysFailRuleDefinition,
  alwaysPassRuleDefinition,
  alwaysThrowRuleDefinition,
  nvmrcRuleDefinition,
} from './rules';

const packagelintReporters: Record<string, PackagelintReporterConstructor> = {
  internalDebugReporter: InternalDebugReporter,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const packagelintRules: Record<string, PackagelintRuleDefinition<any>> = {
  'always-fail': alwaysFailRuleDefinition,
  'always-pass': alwaysPassRuleDefinition,
  'always-throw': alwaysThrowRuleDefinition,
  nvmrc: nvmrcRuleDefinition,
};

// Reporters and rules must each be found under the appropriate keys
checkPackagelintExports({ packagelintReporters, packagelintRules });
export { packagelintReporters, packagelintRules };

// In addition to the main exports above, all the internal pieces are made available
export * from './reporters';
export * from './rules';
