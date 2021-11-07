import { PackagelintRuleCheckDefinition } from '@packagelint/types';

export type AlwaysThrowRuleParams = {
  OptionsType: Record<never, never>;
  ErrorNames: never;
  ErrorData: undefined;
};

function alwaysThrowRuleValidationFn(/* _options: AlwaysThrowRuleOptions, _packageContext: PackagelintValidationContext, */): null {
  throw new Error('This rule will always throw an error');
}

const alwaysThrowRuleDefinition: PackagelintRuleCheckDefinition<AlwaysThrowRuleParams> = {
  name: 'always-throw',
  docs: {
    description: 'This rule will always throw an error.',
    url: 'https://github.com/spautz/packagelint',
  },
  defaultErrorLevel: 'exception',
  defaultOptions: {},
  validationMessages: {},
  doValidation: alwaysThrowRuleValidationFn,
};

export { alwaysThrowRuleDefinition, alwaysThrowRuleValidationFn };
