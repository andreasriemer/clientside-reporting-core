import { WorkerOptions, ReportConfig, ReportingSource, ReportResult } from './reporting/interfaces';
import { combinedSourceValueFilter, combineSources, filterSourcesValues, generateReport } from './reporting/functions';
import { pool, WorkerPool } from 'workerpool';
export { default as workerOptions } from './reporting/constants/workerOptions';
export * from './reporting/interfaces';

let workerPool: WorkerPool;
import('./reporting/constants/workerOptions').then((workerOptions: { default: WorkerOptions }) => {
  const { workerSrc, workerPoolOptions } = workerOptions.default;
  workerPool = pool(workerSrc, { ...workerPoolOptions });
});

const loadSourceValues = async <T extends Record<string, unknown>>(
  sources: Array<ReportingSource<T>>,
  config: Partial<ReportConfig>,
): Promise<{
  sourceValues: Array<T>;
  sourceData: Array<{
    key: string;
    label: string;
    values: Array<T>;
  }>;
}> => {
  const sourceList = config.sources?.reduce((previous: Array<ReportingSource<T>>, { name }) => {
    const s = sources.find(({ key }) => key === name);
    if (s) {
      previous.push(s);
    }
    return previous;
  }, []);
  if (sourceList && sourceList.length) {
    const promise = sourceList.map(async (s) => ({
      values: await s.dataCallback(config.queryParams),
      ...s,
    }));
    if (promise) {
      const sourceData = await Promise.all(promise);
      const ensuredValues: Array<{
        key: string;
        label: string;
        values: Array<T>;
      }> = [];
      for (const data of sourceData) {
        if (data?.values?.length) {
          ensuredValues.push({
            key: data.key,
            label: data.label,
            values: data.values.filter((entry) => !!entry),
          });
        }
      }
      if (config.sources?.length) {
        try {
          const filteredSourcesValues = await workerPool.exec('filterSourcesValues', [
            ensuredValues,
            config.sourcesFilter,
          ]);
          const combinedSources = await workerPool.exec('combineSources', [filteredSourcesValues, config]);
          return {
            sourceValues: await workerPool.exec('combinedSourceValueFilter', [combinedSources, config.sourcesFilter]),
            sourceData: ensuredValues,
          };
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            // tslint:disable-next-line: no-console
            console.error(e);
          }
          return {
            sourceValues: combinedSourceValueFilter<T>(
              combineSources<T>(filterSourcesValues(ensuredValues, config.sourcesFilter), config),
              config.sourcesFilter,
            ),
            sourceData: ensuredValues,
          };
        }
      }
    }
  }
  return {
    sourceValues: [],
    sourceData: [],
  };
};

const getReport = async <T extends Record<string, unknown>>(
  sources: Array<ReportingSource<T>>,
  config: Partial<ReportConfig>,
): Promise<ReportResult<T> | undefined> => {
  const { sourceValues, sourceData } = await loadSourceValues(sources, config);
  const mappedSources = sources.map(({ key, label }) => ({ key, label }));
  if (sourceValues && config.pipes?.length) {
    try {
      const reportData = await workerPool.exec('generateReport', [sourceValues, config, mappedSources]);
      if (reportData) {
        return {
          ...reportData,
          sourceValues,
          sourceData,
        };
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        // tslint:disable-next-line: no-console
        console.error(e);
      }
      const reportData = await generateReport(sourceValues, config, mappedSources);
      if (reportData) {
        return {
          ...reportData,
          sourceValues,
          sourceData,
        };
      }
    }
  }
  return undefined;
};

export default getReport;
