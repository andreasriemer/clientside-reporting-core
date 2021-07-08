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
        value: [...source].reduce((previous: number, current: T | SimpleResult<T>, _, array) => {
          if (isDuplicateValue(current, array, paths[0])) {
            return previous;
          }
          const valueFromPath = valueByPath(current, paths[0]);
          const values = Array.isArray(valueFromPath) ? valueFromPath : [valueFromPath];
          values.forEach((value) => {
            if (value != null) {
              previous += 1;
            }
          });
          return previous;
        }, 0),
      },
    };
    return result;
  };

export default countAggregation;
