import valueByPath from './valueByPath';

const findListPath = <T>(value: T, path: Array<string>): { listPath: Array<string>; restPath: Array<string> } => {
  const listPath: Array<Array<string>> = [];
  path.reduce((previous: Array<string>, current: string) => {
    const valueFromPath = valueByPath<T, T[keyof T]>(value, [...previous, current]);
    if (Array.isArray(valueFromPath)) {
      listPath.push([...previous, current]);
    }
    return [...previous, current];
  }, []);
  return {
    listPath: listPath[0],
    restPath: path.slice(listPath[0].length),
  };
};

export default findListPath;
