/* eslint-disable @typescript-eslint/no-explicit-any */
import { ListResult, SimpleResult } from '../../interfaces/Results';
import isDuplicateValue from '../helper/isDuplicateValue';
import valueByPath from '../helper/valueByPath';

const countAggregation = <T>(source: Array<T> | ListResult<T>, paths: Array<Array<string>>, label: string) => {
  const value = (source as Array<T>).reduce((previous: number, current: T | SimpleResult<T>, _, array) => {
    if (isDuplicateValue(current, array, paths[0])) {
      return previous;
    }
    const valueFromPath = valueByPath(current, paths[0]);
    const values = Array.isArray(valueFromPath) ? valueFromPath : [valueFromPath];
    values.forEach((val) => {
      if (val != null) {
        previous += 1;
      }
    });
    return previous;
  }, 0);
  return {
    source,
    result: {
      label,
      value,
    },
  };
};

export default countAggregation;
