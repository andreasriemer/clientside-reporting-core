/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregationPipeEntry } from '../../interfaces/AggregationPipeEntry';
import { ListResult } from '../../interfaces/Results';
import { TransformationActionType } from '../../types/TransformationActionType';
import filterValues from '../pipes/filterValues';
import groupBy from '../pipes/groupBy';
import takeValues from '../pipes/takeValues';

const transformationActionFromType = <T>(
  type: TransformationActionType,
): AggregationPipeEntry<T, any, ListResult<any>> => {
  switch (type) {
    case 'groupBy':
      return groupBy();
    case 'filterValues':
      return filterValues();
    default:
      return takeValues();
  }
};

export default transformationActionFromType;
