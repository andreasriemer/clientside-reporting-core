/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aggregation } from '../../interfaces/Aggregation';
import { ListResult, SimpleResult } from '../../interfaces/Result';
import valueByPath from '../helper/valueByPath';
import isDuplicateValue from '../helper/isDuplicateValue';
import addValues from '../helper/addValues';

const sumAggregation =
  <T>(): Aggregation<T, number, SimpleResult<number>> =>
  (source: Array<T> | ListResult<T>, paths: Array<Array<string>>, label: string) => {
    return {
      source,
      result: {
        label,
        value: [...source].reduce((previous: number, current, _, array) => {
          if (isDuplicateValue(current, array, paths[0])) {
            return previous;
          }
          const value = valueByPath<T | SimpleResult<T>, number>(current, paths[0]);
          const valueList = Array.isArray(value) ? value : [value];
          return (
            previous +
            valueList.reduce((previousValue, currentValue) => {
              return addValues(previousValue, currentValue);
            }, 0)
          );
        }, 0),
      },
    };
  };

export default sumAggregation;
