/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aggregation } from './Aggregation';
import { AggregationPipeEntry } from './AggregationPipeEntry';
import { ListResult, SimpleResult } from './Result';

export interface ReportingPipeEntry<T> {
  transformation?: {
    action: AggregationPipeEntry<T, any, ListResult<any>>;
    paths: Array<Array<string>>;
    filterValue: Array<string> | undefined;
    additionalData?: Record<string, unknown>;
  };
  aggregations?: Array<{
    paths: Array<Array<string>>;
    aggregation: Aggregation<T, any, SimpleResult<any>>;
    label?: string;
    additionalData?: Record<string, unknown>;
  }>;
}

export type ReportingPipe<T> = Array<ReportingPipeEntry<T>>;
