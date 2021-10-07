/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aggregation } from './Aggregation';
import { Transformation } from './Transformation';

export type ReportingPipeAction<T> = {
  transformation?: Transformation<T>;
  aggregations?: Array<Aggregation<T, any>>;
};

export interface ReportingPipeEntry<T> {
  _id: string;
  label?: string;
  actions: Array<ReportingPipeAction<T>>;
}
