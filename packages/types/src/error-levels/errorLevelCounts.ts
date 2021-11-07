import { PackagelintErrorLevel, ERROR_LEVELS_IN_SEVERITY_ORDER } from './errorLevels';

export type PackagelintErrorLevelCounts = {
  exception: number;
  error: number;
  warning: number;
  suggestion: number;
  ignore: number;
};

const defaultErrorLevelCounts: PackagelintErrorLevelCounts = {
  exception: 0,
  error: 0,
  warning: 0,
  suggestion: 0,
  ignore: 0,
};
Object.freeze(defaultErrorLevelCounts);

function getHighestErrorLevel(
  errorLevelCounts: PackagelintErrorLevelCounts,
): PackagelintErrorLevel | null {
  const highestErrorLevel = ERROR_LEVELS_IN_SEVERITY_ORDER.find((errorLevel) => {
    const count = errorLevelCounts[errorLevel];
    return count > 0;
  });

  return highestErrorLevel || null;
}

export { defaultErrorLevelCounts, getHighestErrorLevel };
