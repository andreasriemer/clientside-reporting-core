import valueByPath from './valueByPath';

const isDuplicateValue = <T>(value: T, list: Array<T>, path: Array<string>): boolean => {
  const index = list.indexOf(value);
  if (index > 0) {
    const currentId = valueByPath(value, [path[0], '_id']);
    if (!!currentId && list.slice(0, index).some((e) => valueByPath(e, [path[0], '_id']) === currentId)) {
      return true;
    }
  }
  return false;
};

export default isDuplicateValue;
