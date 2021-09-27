/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregationAction } from '../../interfaces/Aggregation';
import { ListResult, SimpleResult } from '../../interfaces/Results';
import valueByPath from '../helper/valueByPath';
import isDuplicateValue from '../helper/isDuplicateValue';
import addValues from '../helper/addValues';

const addAggregation =
  <T>(): AggregationAction<T, Array<number> | number, SimpleResult<Array<number> | number>> =>
  (source: Array<T> | ListResult<T>, paths: Array<Array<string>>, label: string) => {
    const result = [...source].reduce((previous: Array<number>, current, _, array) => {
      if (paths.every((path) => isDuplicateValue(current, array, path))) {
        return previous;
      }
      const valuesList = paths.map((path) => {
        const values = valueByPath<T | SimpleResult<T>, string>(current, path);
        return Array.isArray(values) ? values : [values];
      });
      if (!valuesList || valuesList.every((e) => e.every((val) => !val))) {
        return previous;
      }
      const verticalSum = (r: Array<number>, a: Array<number>) => r.map((b: any, i) => addValues(a[i], b));
      const verticalSumResult: Array<number> = (valuesList as any).reduce(verticalSum);
      return [...previous, ...verticalSumResult];
    }, []);
    return {
      source,
      result: {
        label,
        value: result.length > 1 ? result : result[0],
      },
    };
  };

export default addAggregation;
