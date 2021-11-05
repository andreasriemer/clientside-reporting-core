/* eslint-disable @typescript-eslint/no-explicit-any */
import { ListResult, SimpleResult } from '../../interfaces/Results';
import isDuplicateValue from '../helper/isDuplicateValue';
import valueByPath from '../helper/valueByPath';

const countAggregation = <T>(source: Array<T> | ListResult<T>, paths: Array<Array<string>>, label: string) => {
  const result = {
    source,
    result: {
      label,
      value: [...source].reduce((previous: Array<unknown>, current: T | SimpleResult<T>, _, array) => {
        if (paths.every((path) => isDuplicateValue(current, array, path))) {
          return previous;
        }
        const values = paths.reduce((previousValues, path) => {
          const value = valueByPath(current, path);
          return [...previousValues, ...(Array.isArray(value) ? value : [value])];
        }, []);
        return [...previous, ...values.filter((entry) => entry != null)];
      }, []).length,
    },
  };
  return result;
};

export default countAggregation;
