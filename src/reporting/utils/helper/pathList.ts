/* eslint-disable @typescript-eslint/no-explicit-any */
const getPaths = <T extends Record<string, any>>(obj: T): Array<string> => {
  return Object.keys(obj || {}).reduce((objPaths, key) => {
    if (typeof obj[key] === 'object') {
      if (Array.isArray(obj[key])) {
        const arrayPaths = obj[key].reduce((arrayPath: Array<string>, currentArrayEntry: Record<string, unknown>) => {
          if (typeof currentArrayEntry === 'object') {
            const subArrayObjPaths = getPaths(currentArrayEntry);
            return [...arrayPath, ...subArrayObjPaths.filter((pathEntry) => !arrayPath.includes(pathEntry))];
          }
          return arrayPath;
        }, []);
        if (arrayPaths.length) {
          return [
            ...objPaths,
            ...arrayPaths.map((subArrayPath: string) => {
              return [key, subArrayPath].join('.');
            }),
          ];
        }
        return [...objPaths, key];
      }
      const subObjPaths = getPaths(obj[key]);
      return [
        ...objPaths,
        ...subObjPaths.map((subObjPath) => {
          return [key, subObjPath].join('.');
        }),
      ];
    }
    if (Array.isArray(obj) && typeof obj[key] !== 'object') {
      return objPaths;
    }
    return [...objPaths, key];
  }, [] as Array<string>);
};

const pathList = <T extends Array<Record<string, any>>>(source: T): Array<Array<string>> => {
  return source.reduce((previous: Array<Array<string>>, current: Record<string, any>) => {
    const objPaths = getPaths(current);
    const filteredObjectPaths = objPaths.filter(
      (objPath) => !previous.some((previousPaths) => previousPaths.includes(objPath)),
    );
    if (filteredObjectPaths.length) {
      previous.push(filteredObjectPaths);
    }
    return [...previous];
  }, [] as Array<Array<string>>);
};

export default pathList;
