interface ValidationIssue {
  readonly message: string;
  readonly path: ReadonlyArray<PropertyKey>;
}

export const formatZodError = (errors: readonly ValidationIssue[]): string =>
  errors.map((err) => `${err.message} - ${err.path.join(".")}`).join(", ");
