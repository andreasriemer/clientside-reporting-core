/* eslint-disable @typescript-eslint/no-explicit-any */
import { ListResult } from '../../interfaces/Results';
import isDuplicateValue from '../helper/isDuplicateValue';
import valueByPath from '../helper/valueByPath';

const countAggregation = <T>(source: Array<T> | ListResult<T>, paths: Array<Array<string>>, label: string) => {
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
