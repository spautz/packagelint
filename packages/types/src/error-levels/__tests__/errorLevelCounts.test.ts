import { getHighestErrorLevel } from '..';

describe('error-levels/errorLevelCounts', () => {
  describe('severity level totals', () => {
    it('detects most severe level from a set of counts', () => {
      expect(
        getHighestErrorLevel({
          exception: 0,
          error: 1,
          warning: 0,
          suggestion: 2,
          ignore: 3,
        }),
      ).toBe('error');

      expect(
        getHighestErrorLevel({
          exception: 0,
          error: 0,
          warning: 0,
          suggestion: 2,
          ignore: 3,
        }),
      ).toBe('suggestion');
    });

    it('resolves to "ignore" if there are no errors', () => {
      expect(
        getHighestErrorLevel({
          exception: 0,
          error: 0,
          warning: 0,
          suggestion: 0,
          ignore: 0,
        }),
      ).toBe('ignore');

      // @ts-expect-error
      expect(getHighestErrorLevel({})).toBe('ignore');
    });
  });
});
