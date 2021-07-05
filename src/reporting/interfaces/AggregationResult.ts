import { SimpleResult, ListResult } from './Result';

export default interface AggregationResult<T, V, R extends SimpleResult<V> | ListResult<V>> {
  source: Array<T> | ListResult<T>;
  result: R;
}
