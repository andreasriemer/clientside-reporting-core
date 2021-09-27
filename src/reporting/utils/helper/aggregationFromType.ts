import { AggregationAction } from '../../interfaces/Aggregation';
import { SimpleResult } from '../../interfaces/Results';
import { AggregationActionType } from '../../types/AggregationActionType';
import addAggregation from '../aggregations/Add';
import countAggregation from '../aggregations/Count';
import multiplyAggregation from '../aggregations/Multiply';
import sumAggregation from '../aggregations/Sum';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const aggregationFromType = <T>(type: AggregationActionType): AggregationAction<T, any, SimpleResult<any>> => {
  switch (type) {
    case 'countAggregation':
      return countAggregation;
    case 'sumAggregation':
      return sumAggregation();
    case 'multiplyAggregation':
      return multiplyAggregation();
    case 'addAggregation':
      return addAggregation();
    default:
      return countAggregation;
  }
};

export default aggregationFromType;
