import { AggregationType } from '.';
import { AggregationActionType } from '../types/AggregationActionType';
import { TransformationActionType } from '../types/TransformationActionType';
import { TransformationType } from './Transformation';

export type ReportFilterComparators = 'lt' | 'lte' | 'eq' | 'gte' | 'gt';

export type ReportPipeConfig = Array<{
  transformation?: TransformationType;
  aggregations?: Array<AggregationType>;
}>;

export interface ReportSourceFilter {
  sources?: Array<{
    name: string;
    path: Array<string>;
    comparator?: ReportFilterComparators;
  }>;
  filterValue?: Array<string>;
  showFilter?: 'true' | 'false';
  filterType?: 'date' | 'list' | 'text';
  filterLabel?: string;
}

export interface ReportConfig {
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
}
