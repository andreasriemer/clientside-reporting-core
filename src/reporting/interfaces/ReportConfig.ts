import { AggregationType } from '../types/AggregationType';
import { TransformationActionType } from '../types/TransformationActionType';

export type ReportFilterComparators = 'lt' | 'lte' | 'eq' | 'gte' | 'gt';

export type ReportPipeConfig = Array<{
  transformation?: {
    action?: TransformationActionType;
    paths?: Array<Array<string>>;
    filterValue?: Array<string>;
    additionalData?: Record<string, unknown>;
  };
  aggregations?: Array<{
    label?: string;
    paths?: Array<Array<string>>;
    aggregation?: AggregationType;
    additionalData?: Record<string, unknown>;
  }>;
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
