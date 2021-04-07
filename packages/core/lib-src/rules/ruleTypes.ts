type PackagelintUnknownOptions = Record<string, unknown>;
type PackagelintUnknownErrorData = Record<string, unknown>;

export type PackagelintRuleContext = {
  createErrorToReturn: (
    errorName: string,
    ...extraErrorData: Array<PackagelintUnknownErrorData>
  ) => PackagelintRuleValidationError;
  findFileUp: (fileGlob: string) => Promise<null | Array<string>>;
  setErrorData: (
    errorData: PackagelintUnknownErrorData,
    ...extraErrorData: Array<PackagelintUnknownErrorData>
  ) => void;
};

export type PackagelintRuleValidationError = [string, PackagelintUnknownErrorData];

export type PackagelintRuleValidationFn<OptionsType = PackagelintUnknownOptions> = (
  options: OptionsType,
  packageContext: PackagelintRuleContext,
) =>
  | (PackagelintRuleValidationError | null | undefined)
  | Promise<PackagelintRuleValidationError | null | undefined>;

export type PackagelintRuleInfo<OptionsType = PackagelintUnknownOptions> = {
  name: string;
  docs: {
    description: string;
    [key: string]: string;
  };
  defaultOptions: OptionsType;
  optionsSchema: Record<keyof OptionsType, string>;
  messages: Record<string, string>;
  doValidation: PackagelintRuleValidationFn<OptionsType>;
};
