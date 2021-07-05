/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aggregation } from '../../interfaces/Aggregation';
import { ListResult, SimpleResult } from '../../interfaces/Result';
import isDuplicateValue from '../helper/isDuplicateValue';
import valueByPath from '../helper/valueByPath';

const countAggregation =
  <T>(): Aggregation<T, number, SimpleResult<number>> =>
  (source: Array<T> | ListResult<T>, paths: Array<Array<string>>, label: string) => {
    const result = {
      source,
      result: {
        label,
        value: [...source].filter((v, _, array) => {
          if (isDuplicateValue(v, array, paths[0])) {
            return false;
          }
          return valueByPath(v, paths[0]) != null;
        }).length,
      },
    };
    return result;
  };

export default countAggregation;
