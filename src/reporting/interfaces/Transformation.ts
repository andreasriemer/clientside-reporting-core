import { AggregationPipeEntry } from './AggregationPipeEntry';
import { TransformationActionType } from '../types/TransformationActionType';
import { ListResult } from './Results';

export type Transformation<T> = {
  _id: string;
  action: AggregationPipeEntry<T, any, ListResult<any>>;
  paths: Array<Array<string>>;
  filterValue: Array<string> | undefined;
  additionalData?: Record<string, unknown>;
};

export type TransformationType = {
  _id: string;
  action?: TransformationActionType;
  paths?: Array<Array<string>>;
  filterValue?: Array<string>;
  additionalData?: Record<string, unknown>;
};
