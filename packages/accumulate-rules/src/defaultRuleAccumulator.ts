/* @TODO
 * Today this is set up for the packagelint rule config. The plan is to migrate it to a general options-overriding
 * engine later, after release.
 */

type ErrorLevel = 'error' | 'warn' | 'log' | 'ignore';

type RuleOptions = Record<string, any>;
type RuleConfig =
  | string
  | [string, RuleOptions]
  | {
      name: string;
      enabled?: boolean;
      errorLevel?: ErrorLevel;
      options?: RuleOptions;
      resetOptions?: boolean;
    };

interface RootRuleConfig {
  defaultErrorLevel: ErrorLevel;
  failOnErrorLevel: ErrorLevel;
  rules: Array<RuleConfig>;
}

const defaultRootConfig: RootRuleConfig = {
  defaultErrorLevel: 'error',
  failOnErrorLevel: 'error',
  rules: [
    {
      name: '@packagelint/core/always-fail',
      options: {
        message: 'You must define packagelint rules in your config',
      },
    },
  ],
};

const defaultRuleAccumulator = (actualProjectConfig: Partial<RootRuleConfig>) => {
  const rootConfig: RootRuleConfig = {
    ...defaultRootConfig,
    ...actualProjectConfig,
  };

  console.log('defaultRuleAccumulator()', rootConfig);

  // @TODO: process rootConfig.rules options

  // @TODO: process rootConfig.rules validations
};

export { defaultRuleAccumulator };
