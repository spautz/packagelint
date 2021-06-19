import { PackagelintErrorLevel, PackagelintErrorLevelCounts } from './types';
import { ERROR_LEVEL__IGNORE, ERROR_LEVELS_IN_SEVERITY_ORDER } from './errorLevels';

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
): PackagelintErrorLevel {
  const highestErrorLevel = ERROR_LEVELS_IN_SEVERITY_ORDER.find((errorLevel) => {
    const count = errorLevelCounts[errorLevel];
    return count > 0;
  });

  return highestErrorLevel || ERROR_LEVEL__IGNORE;
}

export { defaultErrorLevelCounts, getHighestErrorLevel };
