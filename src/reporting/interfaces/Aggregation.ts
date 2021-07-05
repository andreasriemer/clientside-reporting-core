import AggregationResult from './AggregationResult';
import { ListResult, SimpleResult } from './Result';

export type Aggregation<T, V, R extends SimpleResult<V> | ListResult<V>> = (
  source: Array<T> | ListResult<T>,
  paths: Array<Array<string>>,
  label: string,
  additionalData?: Record<string, unknown>,
) => AggregationResult<T, V, R>;
