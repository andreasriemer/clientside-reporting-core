import { ReportConfig } from './reporting/interfaces/ReportConfig';
import { ReportingSource } from './reporting/interfaces/ReportingSource';
import { SimpleResult, AggregationResult, ReportResult } from './reporting/interfaces/Results';
import aggregationPipe from './reporting/utils/AggregationPipe';
import combinedSourceValueFilter from './reporting/utils/helper/combinedSourceValueFilter';
import combineSources from './reporting/utils/helper/combineSources';
import filterSourcesValues from './reporting/utils/helper/filterSourcesValues';
import pipeFromConfig from './reporting/utils/helper/pipeFromConfig';
import { pool } from 'workerpool';
export * from './reporting/interfaces';
export * from './reporting/utils';

export const KNOWN_SOURCE_NAMES: Array<string> = [];

export const loadSourceValues = async <T extends Record<string, unknown>>(
  sources: Array<ReportingSource<T>>,
  config: Partial<ReportConfig>,
) => {
  const sourceList = config.sources?.reduce((previous: Array<ReportingSource<T>>, { name }) => {
    const s = sources.find(({ key }) => key === name);
    if (s) {
      if (!KNOWN_SOURCE_NAMES.includes(s.key)) {
        KNOWN_SOURCE_NAMES.push(s.key);
      }
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
        const workerPool = pool('./worker/reporting-worker.js', { maxWorkers: 3 });
        try {
          const filteredSourcesValues = await workerPool.exec('filterSourcesValues', [
            ensuredValues,
            config.sourcesFilter,
          ]);
          const combinedSources = await workerPool.exec('combineSources', [filteredSourcesValues, config]);
          return await workerPool.exec('combinedSourceValueFilter', [combinedSources, config.sourcesFilter]);
          return combinedSourceValueFilter<T>(
            combineSources<T>(filterSourcesValues(ensuredValues, config.sourcesFilter), config),
            config.sourcesFilter,
          );
        } catch (_) {
          return combinedSourceValueFilter<T>(
            combineSources<T>(filterSourcesValues(ensuredValues, config.sourcesFilter), config),
            config.sourcesFilter,
          );
        } finally {
          workerPool.terminate();
        }
      }
    }
  }
};

export const generateReport = async <T extends Record<string, unknown>>(
  sourcesValues: Array<T>,
  config: Partial<ReportConfig>,
  sources?: Array<Omit<ReportingSource<T>, 'dataCallback'>>,
) => {
  const reportPipes = config.pipes?.map((pipe) => pipeFromConfig(pipe));
  if (reportPipes?.length) {
    const chartData = reportPipes.reduce(
      (
        chartDataValues: Array<{
          label: string;
          source: Array<unknown>;
          result: Array<AggregationResult<unknown, number, SimpleResult<number>>>;
        }>,
        reportPipe,
      ) => {
        if (reportPipe) {
          const test = aggregationPipe(
            config.label ||
              sources?.find(({ key }) => config.sources?.length && key === config.sources[0].name)?.label ||
              'Report',
            sourcesValues,
            reportPipe,
          );
          chartDataValues.push(test);
        }
        return chartDataValues;
      },
      [],
    );
    return {
      label: config.label,
      results: chartData,
    };
  }
};

export const getReport = async <T extends Record<string, unknown>>(
  sources: Array<ReportingSource<T>>,
  config: Partial<ReportConfig>,
): Promise<ReportResult | undefined> => {
  const sourceValues = await loadSourceValues(sources, config);
  if (sourceValues && config.pipes?.length) {
    const workerPool = pool('./worker/reporting-worker.js', { maxWorkers: 3 });
    try {
      return workerPool.exec('generateReport', [
        sourceValues,
        config,
        sources.map(({ key, label }) => ({ key, label })),
      ]);
    } catch (_) {
      return generateReport(sourceValues, config, sources);
    } finally {
      workerPool.terminate();
    }
  }
  return undefined;
};

export default {
  KNOWN_SOURCE_NAMES,
  loadSourceValues,
  generateReport,
  getReport,
};
