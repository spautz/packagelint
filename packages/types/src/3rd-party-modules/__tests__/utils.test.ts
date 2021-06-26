import { resolveImportedValue } from '../utils';

describe('3rd-party-modules/utils', () => {
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
