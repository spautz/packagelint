module.exports = {
  failOnErrorLevel: 'warning',
  rules: [
    //   // `@packagelint/core` defines the rules, but each rule is disabled by default:
    //   // each `@packagelint/presets` ruleset enables a set of those core rules.
    //   // '@packagelint/presets:library',
    //
    //   // Update the `nvmrc` rule to require at least Node 14, instead of the default.
    //   // This could also be written like this, if you prefer shorthand:
    //   //  ['@packagelint/core:nvmrc', { minVersion: '14' }],
    //   {
    //     name: '@packagelint/core:nvmrc',
    //     options: {
    //       version: '^14',
    //     },
    //   },
    //
    //   // Update the `npmrc` rule to require `save-exact=true`.
    //   // You could use a similar approach if your organization requires a specific `registry` to be set in .npmrc
    //   // {
    //   //   name: '@packagelint/core:npmrc',
    //   //   errorLevel: 'warning',
    //   //   options: {
    //   //     requireValues: {
    //   //       'save-exact': 'true',
    //   //     },
    //   //   },
    //   // },

    {
      name: '@packagelint/core:always-fail',
      errorLevel: 'suggestion',
      options: {
        option1: true,
      },
    },
    {
      name: 'my-alias',
      extendRule: '@packagelint/core:always-fail',
      errorLevel: 'warning',
      options: {
        option2: true,
      },
    },
    {
      name: 'alias-of-my-alias',
      extendRule: 'my-alias',
      errorLevel: 'error',
      options: {
        option3: true,
      },
    },
    {
      name: 'a-different-alias',
      extendRule: '@packagelint/core:always-fail',
      errorLevel: 'warning',
      options: {
        option1: false,
        option4: true,
      },
    },
    {
      name: 'my-alias',
      errorLevel: 'ignore',
      options: {
        option2: false,
      },
    },
    {
      name: 'another-different-alias',
      extendRule: 'my-alias',
      errorLevel: 'warning',
      options: {
        option5: true,
      },
    },
  ],
};
