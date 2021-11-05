import { ReportSourceFilter } from '../interfaces/ReportConfig';
import filteredValues from '../utils/helper/filteredValues';

const combinedSourceValueFilter = <T extends object>(
  combinedSourceValues: Array<T>,
  sourcesFilter: Array<ReportSourceFilter> | undefined,
): Array<T> => {
  const combinedSourceValueFilters = sourcesFilter?.filter(({ sources }) =>
    sources?.some(({ name }) => name === 'combinedSourceValueFilter'),
  );
  if (combinedSourceValueFilters?.length) {
    return combinedSourceValueFilters.reduce((previous: Array<T>, { sources, filterValue }) => {
      if (sources?.length) {
        return sources.reduce((pre: Array<T>, { path }) => {
          return filteredValues<T>(pre, path, filterValue);
        }, previous);
      }
      return previous;
    }, combinedSourceValues);
  }
  return combinedSourceValues;
};

export default combinedSourceValueFilter;
