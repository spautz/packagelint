import { PackagelintRuleCheckDefinition } from '@packagelint/types';
export type AlwaysPassRuleOptions = Record<never, never>;

export type AlwaysPassRuleParams = {
  OptionsType: Record<never, never>;
  ErrorNames: never;
  ErrorData: undefined;
};

function alwaysPassRuleValidationFn(/* _options: AlwaysPassRuleOptions, _packageContext: PackagelintValidationContext */): null {
  return null;
}

const alwaysPassRuleDefinition: PackagelintRuleCheckDefinition<AlwaysPassRuleParams> = {
  name: 'always-pass',
  docs: {
    url: 'https://github.com/spautz/packagelint',
    description: 'This rule will always pass.',
  },
  defaultErrorLevel: 'ignore',
  defaultOptions: {},
  validationMessages: {},
  doValidation: alwaysPassRuleValidationFn,
};

export { alwaysPassRuleDefinition, alwaysPassRuleValidationFn };
