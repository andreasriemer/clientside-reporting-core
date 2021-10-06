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
) => {
  const sourceList = config.sources?.reduce((previous: Array<ReportingSource<T>>, { name }) => {
    const s = sources.find(({ key }) => key === name);
    if (s) {
      previous.push(s);
    }
    return previous;
  }, []);
  if (sourceList && sourceList.length) {
    const promise = sourceList.map(async (s) => ({
      values: await s.dataCallback(),
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
          return await workerPool.exec('combinedSourceValueFilter', [combinedSources, config.sourcesFilter]);
        } catch (e) {
          console.error(e);
          return combinedSourceValueFilter<T>(
            combineSources<T>(filterSourcesValues(ensuredValues, config.sourcesFilter), config),
            config.sourcesFilter,
          );
        }
      }
    }
  }
};

const getReport = async <T extends Record<string, unknown>>(
  sources: Array<ReportingSource<T>>,
  config: Partial<ReportConfig>,
): Promise<ReportResult | undefined> => {
  const sourceValues = await loadSourceValues(sources, config);
  const mappedSources = sources.map(({ key, label }) => ({ key, label }));
  if (sourceValues && config.pipes?.length) {
    try {
      return await workerPool.exec('generateReport', [sourceValues, config, mappedSources]);
    } catch (e) {
      console.error(e);
      return generateReport(sourceValues, config, mappedSources);
    }
  }
  return undefined;
};

export default getReport;
