import { Aggregation } from '../../interfaces/Aggregation';
import { SimpleResult } from '../../interfaces/Result';
import { AggregationType } from '../../types/AggregationType';
import addAggregation from '../aggregations/Add';
import countAggregation from '../aggregations/Count';
import multiplyAggregation from '../aggregations/Multiply';
import sumAggregation from '../aggregations/Sum';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const aggregationFromType = <T>(type: AggregationType): Aggregation<T, any, SimpleResult<any>> => {
  switch (type) {
    case 'countAggregation':
      return countAggregation();
    case 'sumAggregation':
      return sumAggregation();
    case 'multiplyAggregation':
      return multiplyAggregation();
    case 'addAggregation':
      return addAggregation();
    default:
      return countAggregation();
  }
};

export default aggregationFromType;
