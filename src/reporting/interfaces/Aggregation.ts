import { AggregationActionType } from './../types/AggregationActionType';
import { ListResult, SimpleResult, AggregationResult } from './Results';

export type AggregationAction<T, V, R extends SimpleResult<V> | ListResult<V>> = (
  source: Array<T> | ListResult<T>,
  paths: Array<Array<string>>,
  label: string,
  additionalData?: Record<string, unknown>,
) => AggregationResult<T, V, R>;

export type Aggregation<T, V> = {
  _id: string;
  paths: Array<Array<string>>;
  action: AggregationAction<T, V, SimpleResult<V>>;
  label?: string;
  additionalData?: Record<string, unknown>;
};

export type AggregationType = {
  _id: string;
  label?: string;
  paths?: Array<Array<string>>;
  action?: AggregationActionType;
  additionalData?: Record<string, unknown>;
};
