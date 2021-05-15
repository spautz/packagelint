module.exports = {
  failOnErrorLevel: 'exception',
  rules: [
    // `@packagelint/core` defines the rules, but each rule is disabled by default:
    // this ruleset from `@packagelint/presets` enables a set of those core rules.
    '@packagelint/presets:library',

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
      name: 'my-local-alias-1',
      extendRule: '@packagelint/core:always-fail',
    },
    {
      name: '@packagelint/core:always-fail',
      errorLevel: 'suggestion',
      options: {
        option1: true,
      },
    },
    {
      name: 'my-local-alias-2',
      extendRule: '@packagelint/core:always-fail',
      errorLevel: 'suggestion',
      options: {
        option2: true,
      },
    },
    {
      name: 'library-alias2',
      options: {
        oneMoreOption: true,
      },
    },
  ],
};
