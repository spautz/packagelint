// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyArray = Array<any>;
type UnknownInstance = unknown;

interface GenericClassConstructor<
  ArgsType extends AnyArray = AnyArray,
  InstanceType = UnknownInstance,
> {
  new (...args: ArgsType): InstanceType;
}

type GenericFunctionConstructor<
  ArgsType extends AnyArray = AnyArray,
  InstanceType = UnknownInstance,
> = (...args: ArgsType) => InstanceType;

/**
 * Core functionality is wrapped up in classes -- or in a closure, if you prefer. This helper lets things like
 * RuleAccumulator,
 */
function constructClassOrFunction<
  ClassConstructorType extends GenericClassConstructor<ArgsType, InstanceType>,
  FunctionConstructorType extends GenericFunctionConstructor<ArgsType, InstanceType>,
  ArgsType extends AnyArray = AnyArray,
  InstanceType = UnknownInstance,
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

function isFunction(someValue: unknown): someValue is (...args: Array<unknown>) => unknown {
  return typeof someValue === 'function';
}

export { constructClassOrFunction, isFunction };
