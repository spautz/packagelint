import {
  PackagelintRuleCheckDefinition,
  PackagelintRuleCheckValidationFn,
} from '@packagelint/types';

export type AlwaysFailRuleParams = {
  OptionsType: Record<never, never>;
  ErrorNames: 'alwaysFail';
  ErrorData: undefined;
};

const alwaysFailRuleValidationFn: PackagelintRuleCheckValidationFn<AlwaysFailRuleParams> = (
  _options,
  packageContext,
) => {
  return packageContext.createErrorToReturn('alwaysFail');
};

const alwaysFailRuleDefinition: PackagelintRuleCheckDefinition<AlwaysFailRuleParams> = {
  name: 'always-fail',
  docs: {
    url: 'https://github.com/spautz/packagelint',
    description: 'This rule will always fail.',
  },
  defaultErrorLevel: 'error',
  defaultOptions: {},
  validationMessages: {
    en: {
      alwaysFail: 'This rule will always fail',
    },
  },
  doValidation: alwaysFailRuleValidationFn,
};

export { alwaysFailRuleDefinition, alwaysFailRuleValidationFn };
