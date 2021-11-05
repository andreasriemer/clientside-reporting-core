import { ReportSourceFilter } from '../interfaces/ReportConfig';
import filteredListResultEntry from '../utils/helper/filteredListResultEntry';
import filteredValues from '../utils/helper/filteredValues';

const filterSourcesValues = <T extends object>(
  sources: Array<{
    key: string;
    label: string;
    values: Array<T>;
  }>,
  sourcesFilter?: Array<ReportSourceFilter>,
) => {
  if (sourcesFilter && sourcesFilter.some(({ filterValue }) => !!filterValue?.length)) {
    return sources.map((source) => {
      let filteredSourceValues: Array<T> = source.values;
      const sourceFilters = sourcesFilter.filter(({ sources: sourcesFilterSources }) =>
        sourcesFilterSources?.some(({ name }) => name === source.key),
      );
      sourceFilters.forEach((sourceFilter) => {
        if (sourceFilter.filterValue?.length) {
          const sourceFilterSources = sourceFilter?.sources?.filter(({ name }) => name === source.key);
          if (sourceFilterSources) {
            sourceFilterSources.forEach((sourceFilterSource) => {
              filteredSourceValues = filteredValues(
                filteredSourceValues,
                sourceFilterSource.path,
                sourceFilter.filterValue,
                sourceFilterSource.comparator,
              ).map(
                filteredListResultEntry<string, T>(
                  sourceFilter.filterValue,
                  sourceFilterSource.path,
                  sourceFilterSource.comparator,
                ),
              );
            });
          }
        }
      });
      return {
        ...source,
        values: filteredSourceValues,
      };
    });
  }
  return sources;
};

export default filterSourcesValues;
