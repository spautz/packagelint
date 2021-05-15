import { constructClassOrFunction, resolveImportedValue } from '../resolvers';

describe('util/resolvers', () => {
  describe('constructClassOrFunction', () => {
    it('instantiates simple classes', () => {
      const fnInsideConstructor = jest.fn();

      class MyClass {
        constructor() {
          fnInsideConstructor();
        }
      }

      const instance = constructClassOrFunction(MyClass);

      expect(instance).toBeInstanceOf(MyClass);
      expect(fnInsideConstructor).toBeCalled();
      expect(fnInsideConstructor).toBeCalledTimes(1);
    });

    it('instantiates classes with arguments', () => {
      const fnInsideConstructor = jest.fn();

      class MyClass {
        constructor(value1: string, value2: number) {
          fnInsideConstructor(value1, value2);
        }
      }

      const instance = constructClassOrFunction(MyClass, 'test', 123);

      expect(instance).toBeInstanceOf(MyClass);
      expect(fnInsideConstructor).toBeCalled();
      expect(fnInsideConstructor).toBeCalledTimes(1);
      expect(fnInsideConstructor).toBeCalledWith('test', 123);
    });

    it('instantiates complex classes', () => {
      const fnInsideBaseClass = jest.fn();
      const fnInsideMyClass = jest.fn();

      class MyBaseClass {
        constructor(value: string) {
          fnInsideBaseClass(value);
        }
      }

      class MyClass extends MyBaseClass {
        constructor(value1: string, value2: number) {
          super(value1);
          fnInsideMyClass(value2);
        }
      }

      const instance = constructClassOrFunction(MyClass, 'test', 123);

      expect(instance).toBeInstanceOf(MyClass);
      expect(instance).toBeInstanceOf(MyBaseClass);
      expect(fnInsideBaseClass).toBeCalled();
      expect(fnInsideBaseClass).toBeCalledTimes(1);
      expect(fnInsideBaseClass).toBeCalledWith('test');
      expect(fnInsideMyClass).toBeCalled();
      expect(fnInsideMyClass).toBeCalledTimes(1);
      expect(fnInsideMyClass).toBeCalledWith(123);
    });

    it('instantiates function-prototype classes', () => {
      const fnInsideConstructor = jest.fn();

      function MyOldSchoolClass(this: typeof MyOldSchoolClass.prototype) {
        fnInsideConstructor();
        this.wasCreated();
      }
      MyOldSchoolClass.prototype = {
        wasCreated: jest.fn(),
      };

      const instance = constructClassOrFunction(MyOldSchoolClass);

      expect(instance).toBeInstanceOf(MyOldSchoolClass);
      expect(fnInsideConstructor).toBeCalled();
      expect(fnInsideConstructor).toBeCalledTimes(1);
      expect(instance.wasCreated).toBeCalled();
      expect(instance.wasCreated).toBeCalledTimes(1);
    });

    it('instantiates function-prototype classes with arguments', () => {
      const fnInsideConstructor = jest.fn();

      function MyOldSchoolClass(value1: string, value2: number) {
        fnInsideConstructor(value1, value2);
      }

      const instance = constructClassOrFunction(MyOldSchoolClass, 'test', 123);

      expect(instance).toBeInstanceOf(MyOldSchoolClass);
      expect(fnInsideConstructor).toBeCalled();
      expect(fnInsideConstructor).toBeCalledTimes(1);
      expect(fnInsideConstructor).toBeCalledWith('test', 123);
    });

    it('calls arrow functions', () => {
      const fnInsideConstructor = jest.fn();

      const myClosureConstructor = () => {
        fnInsideConstructor();
        return { thisIsAFakeInstance: true };
      };

      const instance = constructClassOrFunction(myClosureConstructor);

      expect(instance.thisIsAFakeInstance).toBe(true);
      expect(fnInsideConstructor).toBeCalled();
      expect(fnInsideConstructor).toBeCalledTimes(1);
    });

    it('calls arrow functions with arguments', () => {
      const fnInsideConstructor = jest.fn();

      const myClosureConstructor = (value1: string, value2: number) => {
        fnInsideConstructor(value1, value2);
        return {
          thisIsAFakeInstance: true,
          value1,
          value2,
        };
      };

      const instance = constructClassOrFunction(myClosureConstructor, 'test', 123);

      expect(instance.thisIsAFakeInstance).toBe(true);
      expect(fnInsideConstructor).toBeCalled();
      expect(fnInsideConstructor).toBeCalledTimes(1);
      expect(fnInsideConstructor).toBeCalledWith('test', 123);
      expect(instance.value1).toBe('test');
      expect(instance.value2).toBe(123);
    });
  });

  describe('resolveImportedValue', () => {
    it('promisifies raw values', () => {
      const resolvedValue = resolveImportedValue(123);

      expect(resolvedValue).toBeInstanceOf(Promise);
      expect(resolvedValue).resolves.toEqual(123);
    });

    it('handles and promisifies functions', () => {
      const resolvedValue = resolveImportedValue(() => 123);

      expect(resolvedValue).toBeInstanceOf(Promise);
      expect(resolvedValue).resolves.toEqual(123);
    });

    it('handles existing promises', () => {
      const resolvedValue = resolveImportedValue(Promise.resolve(123));

      expect(resolvedValue).toBeInstanceOf(Promise);
      expect(resolvedValue).resolves.toEqual(123);
    });

    it('handles functions that return promises', () => {
      const resolvedValue = resolveImportedValue(() => Promise.resolve(123));

      expect(resolvedValue).toBeInstanceOf(Promise);
      expect(resolvedValue).resolves.toEqual(123);
    });

    it('does not alter functions that return functions', () => {
      const myFn = jest.fn();
      const resolvedValue = resolveImportedValue(() => myFn);

      expect(resolvedValue).toBeInstanceOf(Promise);
      expect(resolvedValue).resolves.toEqual(myFn);
      expect(myFn).not.toBeCalled();
    });

    it('does not alter promises that return functions', () => {
      const myFn = jest.fn();
      const resolvedValue = resolveImportedValue(Promise.resolve(myFn));

      expect(resolvedValue).toBeInstanceOf(Promise);
      expect(resolvedValue).resolves.toEqual(myFn);
      expect(myFn).not.toBeCalled();
    });

    it('rejects when functions throw', () => {
      const badModule = () => {
        throw new Error('Oh no!');
      };
      const resolvedValue = resolveImportedValue(badModule);

      expect.assertions(2);
      expect(resolvedValue).toBeInstanceOf(Promise);
      return expect(resolvedValue).rejects.toThrowError('Oh no!');
    });

    it('rejects when promises are rejected', () => {
      const badModule = Promise.reject('Oh no!');
      const resolvedValue = resolveImportedValue(badModule);

      expect.assertions(2);
      expect(resolvedValue).toBeInstanceOf(Promise);
      return expect(resolvedValue).rejects.toEqual('Oh no!');
    });
  });
});
