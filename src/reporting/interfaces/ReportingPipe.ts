/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aggregation } from './Aggregation';
import { Transformation } from './Transformation';

export interface ReportingPipeEntry<T> {
  transformation?: Transformation<T>;
  aggregations?: Array<Aggregation<T, any>>;
}

export type ReportingPipe<T> = Array<ReportingPipeEntry<T>>;
