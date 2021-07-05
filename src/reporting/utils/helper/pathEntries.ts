import valueByPath from './valueByPath';

const pathEntries = <T>(data?: Array<{ list?: Array<T>; path?: Array<string> }>): Array<string> => {
  return (
    data?.reduce((previous: Array<string>, { list, path }: { list?: Array<T>; path?: Array<string> }) => {
      if (list?.length && path) {
        return list.reduce((prev, curr) => {
          const option = valueByPath<unknown, never>(curr, path);
          const options = Array.isArray(option) ? option : [option];
          if (!!option && options.some((o) => !prev.includes(o))) {
            prev.push(...options.filter((o) => !prev.includes(o)));
          }
          return prev;
        }, []);
      }
      return previous;
    }, []) || []
  );
};

export default pathEntries;
