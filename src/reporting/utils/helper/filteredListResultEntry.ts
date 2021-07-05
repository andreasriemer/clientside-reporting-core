import { ReportFilterComparators } from '../../interfaces/ReportConfig';
import filteredValues from './filteredValues';
import findListPath from './findListPath';
import setValueByPath from './setValueByPath';
import valueByPath from './valueByPath';

const filteredListResultEntry =
  <T, E>(
    comparativeValue: string | Array<string> | undefined,
    path: Array<string>,
    comparator?: ReportFilterComparators,
  ) =>
  (entry: E) => {
    if (comparativeValue) {
      const comparativeValues = Array.isArray(comparativeValue) ? comparativeValue : [comparativeValue];
      const valueFromPath = valueByPath<E, string>(entry, path);
      if (Array.isArray(valueFromPath)) {
        const { listPath, restPath } = findListPath(entry, path);
        const entryList = valueByPath<E, E[keyof E]>(entry, listPath);
        const filteredEntryList = filteredValues(
          entryList as unknown as Array<Record<string, unknown>>,
          restPath,
          comparativeValues,
          comparator,
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return setValueByPath<any, any, any>(entry, listPath, filteredEntryList);
      }
    }
    return entry;
  };

export default filteredListResultEntry;
