export interface SimpleResult<T> {
  value: T;
  label: string;
}

export type ListResult<T> = Array<SimpleResult<T>>;

export interface AggregationResult<T, V, R extends SimpleResult<V> | ListResult<V>> {
  source: Array<T> | ListResult<T>;
  result: R;
}

export interface ReportResultEntry<T extends object> {
  _id: string;
  label: string;
  source: Array<T>;
  result: Array<AggregationResult<T, number, SimpleResult<number>>>;
}

export interface ReportData<T extends object> {
  _id: string | undefined;
  label: string | undefined;
  results: Array<ReportResultEntry<T>>;
}
export interface ReportResult<T extends object> extends ReportData<T> {
  sourceValues: Array<T>;
  sourceData: Array<{
    key: string;
    label: string;
    values: Array<T>;
  }>;
}
