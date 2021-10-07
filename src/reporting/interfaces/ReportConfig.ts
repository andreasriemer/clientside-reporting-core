import { AggregationType } from './Aggregation';
import { TransformationType } from './Transformation';

export type ReportFilterComparators = 'lt' | 'lte' | 'eq' | 'gte' | 'gt';
export type ReportDateTypes = 'year' | 'month' | 'week' | 'day';
export type ReportFilterTypes = 'date' | 'dateRange' | 'list' | 'text';
export type ReportShowFilterTypes = 'true' | 'false';

export type ReportPipeConfig = {
  _id: string;
  label?: string;
  actions: Array<{
    transformation?: TransformationType;
    aggregations?: Array<AggregationType>;
  }>;
};

export interface ReportSourceFilter {
  sources?: Array<{
    name: string;
    path: Array<string>;
    comparator?: ReportFilterComparators;
  }>;
  filterValue?: Array<string>;
  showFilter?: ReportShowFilterTypes;
  filterType?: ReportFilterTypes;
  filterLabel?: string;
}

export interface ReportConfig {
  _id: string;
  type: string;
  sources: Array<{
    name: string;
    mappingPath?: { srcPath: Array<string>; dstPath: Array<string> };
  }>;
  label: string;
  pipes: Array<ReportPipeConfig>;
  valueMapping: Record<string, string>;
  sourcesFilter: Array<ReportSourceFilter>;
  additionalData?: Record<string, unknown>;
  queryParams?: Record<string, unknown>;
}
