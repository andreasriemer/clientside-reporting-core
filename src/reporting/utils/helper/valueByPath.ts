/* eslint-disable @typescript-eslint/no-explicit-any */

const valueByPath = <T extends Record<string, any> | unknown, R extends any>(
  obj: T,
  path: Array<string>,
): R | Array<R> => {
  return path.reduce((previous: any, current, currentIndex, array) => {
    if (previous == null || (typeof previous === 'object' && Array.isArray(previous))) {
      return previous;
    }
    if (previous[current] != null && typeof previous[current] === 'object' && Array.isArray(previous[current])) {
      const remainingPath = [...array].splice(currentIndex + 1);
      return previous[current].reduce((previousListValues: Array<any>, currentListValue: any) => {
        const result = valueByPath(currentListValue, remainingPath);
        if (result != null) {
          previousListValues.push(result);
        }
        return previousListValues;
      }, []);
    }
    return previous && previous[current] != null ? previous[current] : undefined;
  }, obj) as R;
};

export default valueByPath;
