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

export { constructClassOrFunction };
