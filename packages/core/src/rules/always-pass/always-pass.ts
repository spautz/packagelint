import { PackagelintRuleDefinition } from '@packagelint/types';

export type AlwaysPassRuleOptions = Record<never, never>;

const alwaysPassRuleDefinition: PackagelintRuleDefinition<AlwaysPassRuleOptions> = {
  name: 'always-pass',
  docs: {
    description: 'This rule will always pass.',
    url: 'https://github.com/spautz/packagelint',
  },
  defaultErrorLevel: 'ignore',
  defaultOptions: {},
  messages: {
    alwaysPass: 'This rule will always pass',
  },
  doValidation: alwaysPassRuleValidationFn,
};

function alwaysPassRuleValidationFn(/* _options: AlwaysPassRuleOptions, _packageContext: PackagelintValidationContext */): null {
  return null;
}

export { alwaysPassRuleDefinition, alwaysPassRuleValidationFn };
