export interface SimpleResult<T> {
  value: T;
  label: string;
}

export type ListResult<T> = Array<SimpleResult<T>>;
