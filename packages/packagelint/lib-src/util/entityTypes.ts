export type PackagelintRuleEntityType =
  | typeof PACKAGELINT_ENTITY_TYPE__RULE
  | typeof PACKAGELINT_ENTITY_TYPE__RULESET;
export type PackagelintEntityType =
  | typeof PACKAGELINT_ENTITY_TYPE__RULE
  | typeof PACKAGELINT_ENTITY_TYPE__RULESET
  | typeof PACKAGELINT_ENTITY_TYPE__REPORTER;

const PACKAGELINT_ENTITY_TYPE__RULE = 'packagelint_rule' as const;
const PACKAGELINT_ENTITY_TYPE__RULESET = 'packagelint_ruleset' as const;
const PACKAGELINT_ENTITY_TYPE__REPORTER = 'packagelint_reporter' as const;

const ALL_ENTITY_TYPES = {
  RULE: PACKAGELINT_ENTITY_TYPE__RULE,
  RULESET: PACKAGELINT_ENTITY_TYPE__RULESET,
  RESULTS: PACKAGELINT_ENTITY_TYPE__REPORTER,
};
const ALL_ENTITY_TYPE_VALUES: Array<PackagelintEntityType> = [
  PACKAGELINT_ENTITY_TYPE__RULE,
  PACKAGELINT_ENTITY_TYPE__RULESET,
  PACKAGELINT_ENTITY_TYPE__REPORTER,
];

function isValidEntityType(entityType: unknown): entityType is PackagelintEntityType {
  return ALL_ENTITY_TYPE_VALUES.includes(entityType as PackagelintEntityType);
}

export {
  PACKAGELINT_ENTITY_TYPE__RULE,
  PACKAGELINT_ENTITY_TYPE__RULESET,
  PACKAGELINT_ENTITY_TYPE__REPORTER,
  ALL_ENTITY_TYPES,
  ALL_ENTITY_TYPE_VALUES,
  isValidEntityType,
};
