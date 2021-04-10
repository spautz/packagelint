import { PackagelintRuleDefinition, PackagelintValidationContext } from '../types';

export type AlwaysFailRuleOptions = {};

const alwaysFailRuleDefinition: PackagelintRuleDefinition<AlwaysFailRuleOptions> = {
  name: '@packagelint/core/always-fail',
  docs: {
    description: 'This rule will always fail. Useful for testing.',
    url: 'https://github.com/spautz/packagelint',
  },
  defaultErrorLevel: 'error',
  defaultOptions: {},
  messages: {
    alwaysFail: 'This rule will always fail',
  },
  doValidation: alwaysFailRuleValidationFn,
};

function alwaysFailRuleValidationFn(
  _options: AlwaysFailRuleOptions,
  packageContext: PackagelintValidationContext,
) {
  const { createErrorToReturn } = packageContext;
  return createErrorToReturn('alwaysFail');
}

export { alwaysFailRuleDefinition, alwaysFailRuleValidationFn };
