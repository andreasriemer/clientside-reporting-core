import { REPORTING_SOURCES } from '../../../index';
import valueByPath from './valueByPath';

const KNOWN_SOURCE_NAMES = REPORTING_SOURCES?.map(({ key }) => key) || [];

const isDuplicateValue = <T>(value: T, list: Array<T>, path: Array<string>): boolean => {
  const index = list.indexOf(value);
  if (index > 0 && KNOWN_SOURCE_NAMES.includes(path[0])) {
    const currentId = valueByPath(value, [path[0], '_id']);
    if (!!currentId && list.slice(0, index).some((e) => valueByPath(e, [path[0], '_id']) === currentId)) {
      return true;
    }
  }
  return false;
};

export default isDuplicateValue;
