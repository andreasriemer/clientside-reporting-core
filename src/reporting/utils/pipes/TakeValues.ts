import { AggregationPipeEntry } from '../../interfaces/AggregationPipeEntry';
import { ListResult } from '../../interfaces/Result';

const takeValues =
  <T, V extends T>(): AggregationPipeEntry<T, V, ListResult<V>> =>
  (source: Array<T> | ListResult<T>) => {
    return {
      source,
      result: source as never,
    };
  };

export default takeValues;
