/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregationAction } from '../../interfaces/Aggregation';
import { ListResult, SimpleResult } from '../../interfaces/Results';
import valueByPath from '../helper/valueByPath';
import isDuplicateValue from '../helper/isDuplicateValue';
import addValues from '../helper/addValues';

const sumAggregation =
  <T>(): AggregationAction<T, number, SimpleResult<number>> =>
  (source: Array<T> | ListResult<T>, paths: Array<Array<string>>, label: string) => {
    return {
      source,
      result: {
        label,
        value: [...source].reduce((previous: number, current, _, array) => {
          if (paths.every((path) => isDuplicateValue(current, array, path))) {
            return previous;
          }
          const values = paths.reduce((previousValues: Array<number>, path) => {
            const value = valueByPath<T | SimpleResult<T>, number>(current, path);
            return [...previousValues, ...(Array.isArray(value) ? value : [value])];
          }, []);
          return (
            previous +
            values.reduce((previousValue, currentValue) => {
              return addValues(previousValue, currentValue);
            }, 0)
          );
        }, 0),
      },
    };
  };

export default sumAggregation;
