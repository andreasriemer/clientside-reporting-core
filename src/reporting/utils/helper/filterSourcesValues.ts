import { ReportSourceFilter } from '../../interfaces/ReportConfig';
import filteredListResultEntry from './filteredListResultEntry';
import filteredValues from './filteredValues';

const filterSourcesValues = (
  sources: Array<{
    key: string;
    label: string;
    values: Array<Record<string, unknown>>;
  }>,
  sourcesFilter?: Array<ReportSourceFilter>,
) => {
  if (sourcesFilter && sourcesFilter.some(({ filterValue }) => !!filterValue?.length)) {
    return sources.map((source) => {
      let filteredSourceValues: Array<Record<string, unknown>> = source.values;
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
                filteredListResultEntry<string, Record<string, unknown>>(
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
