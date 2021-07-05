const isTypeOf = <T extends object>(obj: unknown, ...uniqueKeys: Array<keyof T>): obj is T =>
  obj && (uniqueKeys.every((uniqueKey) => (obj as any)[uniqueKey] != null) as any);

export default isTypeOf;
