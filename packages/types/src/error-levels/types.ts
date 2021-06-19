export type PackagelintErrorLevel = 'exception' | 'error' | 'warning' | 'suggestion' | 'ignore';

export type PackagelintErrorLevelCounts = {
  exception: number;
  error: number;
  warning: number;
  suggestion: number;
  ignore: number;
};
