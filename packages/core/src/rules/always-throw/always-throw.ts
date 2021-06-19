import { PackagelintRuleDefinition, PackagelintValidationContext } from '@packagelint/types';

export type AlwaysThrowRuleOptions = {};

const alwaysThrowRuleDefinition: PackagelintRuleDefinition<AlwaysThrowRuleOptions> = {
  name: 'always-throw',
  docs: {
    description: 'This rule will always throw an error.',
    url: 'https://github.com/spautz/packagelint',
  },
  defaultErrorLevel: 'exception',
  defaultOptions: {},
  messages: {},
  doValidation: alwaysThrowRuleValidationFn,
};

function alwaysThrowRuleValidationFn(
  _options: AlwaysThrowRuleOptions,
  _packageContext: PackagelintValidationContext,
): null {
  throw new Error('This rule will always throw an error');
}

export { alwaysThrowRuleDefinition, alwaysThrowRuleValidationFn };
