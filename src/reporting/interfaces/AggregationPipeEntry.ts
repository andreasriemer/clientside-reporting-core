import { Aggregation } from './Aggregation';
import { ListResult, SimpleResult, AggregationResult } from './Results';

export type AggregationPipeEntry<T, V, R extends SimpleResult<V> | ListResult<V>> = (
  source: Array<T> | ListResult<T>,
  paths: Array<Array<string>>,
  filterValue?: Array<string>,
  aggregations?: Array<Aggregation<T, V>>,
  additionalData?: Record<string, unknown>,
) => AggregationResult<T, V, R>;
