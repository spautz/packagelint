import {
  PackagelintException_Import,
  PackagelintException_UserConfig,
  PackagelintExportedRulesObject,
  PackagelintResolved3rdPartyModule,
  PackagelintResolved3rdPartyModuleObject,
  PackagelintRuleDefinition,
  PackagelintRuleName,
  PackagelintRulesetDefinition,
  resolveImportedValue,
} from '@packagelint/types';

async function resolveRuleOrRuleset(
  name: PackagelintRuleName,
): Promise<PackagelintRuleDefinition | PackagelintRulesetDefinition> {
  // @TODO: Implement this properly
  // @TODO: Validation

  const [packageName, ruleOrRulesetName] = name.split(':');

  if (!packageName || !ruleOrRulesetName) {
    // @FIXME: Need to handle custom rule names: aliases of aliases are currently broken!
    throw new PackagelintException_UserConfig(`Rule "${name}" is not a valid rule name`);
  }

  const packageExports = await resolveImportedValue<PackagelintResolved3rdPartyModuleObject>(
    require(packageName) as PackagelintResolved3rdPartyModule,
  );
  const packagelintRules = await resolveImportedValue<PackagelintExportedRulesObject | undefined>(
    packageExports.packagelintRules,
  );

  if (!packagelintRules) {
    throw new PackagelintException_Import(
      `Package "${packageName}" does not provide any packagelint rules`,
    );
  }
  if (typeof packagelintRules !== 'object') {
    throw new PackagelintException_Import(
      `Package "${packageName}" does not provide any valid packagelint rules`,
    );
  }
  if (!Object.prototype.hasOwnProperty.call(packagelintRules, ruleOrRulesetName)) {
    throw new PackagelintException_Import(
      `Package "${packageName}" does not provide rule "${ruleOrRulesetName}"`,
    );
  }

  return packagelintRules[ruleOrRulesetName];
}

export { resolveRuleOrRuleset };
