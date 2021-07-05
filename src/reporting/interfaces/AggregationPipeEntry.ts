import { Aggregation } from './Aggregation';
import AggregationResult from './AggregationResult';
import { ListResult, SimpleResult } from './Result';

export type AggregationPipeEntry<T, V, R extends SimpleResult<V> | ListResult<V>> = (
  source: Array<T> | ListResult<T>,
  paths: Array<Array<string>>,
  filterValue?: Array<string>,
  aggregations?: Array<{
    paths: Array<Array<string>>;
    aggregation: Aggregation<T, V, SimpleResult<V>>;
    label?: string;
    additionalData?: Record<string, unknown>;
  }>,
  additionalData?: Record<string, unknown>,
) => AggregationResult<T, V, R>;
