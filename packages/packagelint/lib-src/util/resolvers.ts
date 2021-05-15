interface GenericClassConstructor<ArgsType extends Array<any> = Array<any>, InstanceType = any> {
  new (...args: ArgsType): InstanceType;
}

type GenericFunctionConstructor<ArgsType extends Array<any> = Array<any>, InstanceType = any> = (
  ...args: ArgsType
) => InstanceType;

/**
 * Core functionality is wrapped up in classes -- or in a closure, if you prefer. This helper lets things like
 * RuleAccumulator,
 */
function constructClassOrFunction<
  ClassConstructorType extends GenericClassConstructor<ArgsType, InstanceType>,
  FunctionConstructorType extends GenericFunctionConstructor<ArgsType, InstanceType>,
  ArgsType extends Array<any> = any,
  InstanceType = any,
>(
  ReporterClassOrConstructor: ClassConstructorType | FunctionConstructorType,
  ...args: ArgsType
): InstanceType {
  try {
    return new (ReporterClassOrConstructor as ClassConstructorType)(...args);
  } catch (err) {
    return (ReporterClassOrConstructor as FunctionConstructorType)(...args);
  }
}

function isFunction(someValue: unknown): someValue is Function {
  return typeof someValue === 'function';
}

/**
 * When importing configs, rules, presets, or reporters, the value may be exported directly, or wrapped in a promise
 * or function. This standardizes the imported value so that it's always delivered via a promise.
 */
async function resolveImportedValue<ExpectedType>(
  rawValue: ExpectedType | Promise<ExpectedType> | (() => ExpectedType | Promise<ExpectedType>),
): Promise<ExpectedType> {
  if (isFunction(rawValue)) {
    return rawValue();
  } else {
    return rawValue;
  }
}

export { constructClassOrFunction, resolveImportedValue };
