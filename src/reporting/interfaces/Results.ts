export interface SimpleResult<T> {
  value: T;
  label: string;
}

export type ListResult<T> = Array<SimpleResult<T>>;

export interface AggregationResult<T, V, R extends SimpleResult<V> | ListResult<V>> {
  source: Array<T> | ListResult<T>;
  result: R;
}

export interface ReportResult {
  label: string | undefined;
  results: Array<{
    label: string;
    source: Array<unknown>;
    result: Array<AggregationResult<unknown, number, SimpleResult<number>>>;
  }>;
}
