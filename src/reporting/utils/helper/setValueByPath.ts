/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */

const setValueByPath = <T, V, R>(entry: T, path: Array<string>, value: V): R => {
  const copy = JSON.parse(JSON.stringify(entry));
  path.reduce((o: any, key, index, keys) => {
    if (index < keys.length - 1) {
      // eslint-disable-next-line no-nested-ternary
      o[key] = o[key] != null ? o[key] : typeof keys[index + 1] === 'number' ? [] : {};
      return o[key];
    }
    o[key] = value;
    return o;
  }, copy);
  return copy as unknown as R;
};

export default setValueByPath;
