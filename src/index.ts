import AggregationResult from './reporting/interfaces/AggregationResult';
import { ReportConfig } from './reporting/interfaces/ReportConfig';
import { SimpleResult } from './reporting/interfaces/Result';
import aggregationPipe from './reporting/utils/AggregationPipe';
import combinedSourceValueFilter from './reporting/utils/helper/combinedSourceValueFilter';
import combineSources from './reporting/utils/helper/combineSources';
import filterSourcesValues from './reporting/utils/helper/filterSourcesValues';
import pipeFromConfig from './reporting/utils/helper/pipeFromConfig';

export const REPORTING_SOURCES: Array<{
  key: string;
  label: string;
  dataCallback: () => Promise<Array<unknown> | undefined> | undefined;
}> = [];

class ClientSideReporting<T extends Record<string, unknown>> {
  private sources: Array<{
    key: string;
    label: string;
    dataCallback: () => Promise<Array<T> | undefined> | undefined;
  }> = [];

  private loadSource = async (
    sources: Array<{
      key: string;
      label: string;
      dataCallback: () => Promise<Array<T> | undefined> | undefined;
    }>,
    config: Partial<ReportConfig>,
  ) => {
    const sourceList = config.sources?.reduce(
      (
        previous: Array<{
          key: string;
          label: string;
          dataCallback: () => Promise<Array<T> | undefined> | undefined;
        }>,
        { name },
      ) => {
        const s = sources.find(({ key }) => key === name);
        if (s) {
          previous.push(s);
        }
        return previous;
      },
      [],
    );
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
        }> = sourceData.reduce(
          (
            prev: Array<{
              key: string;
              label: string;
              values: Array<T>;
            }>,
            curr:
              | {
                  key: string;
                  label: string;
                  values: Array<T> | undefined;
                }
              | undefined,
          ) => {
            if (curr?.values?.length) {
              prev.push({
                ...curr,
                values: curr.values.filter((entry) => !!entry),
              });
            }
            return prev;
          },
          [],
        );
        if (config.sources?.length) {
          return combinedSourceValueFilter<T>(
            combineSources<T>(filterSourcesValues(ensuredValues, config.sourcesFilter), config),
            config.sourcesFilter,
          );
        }
      }
    }
  };

  init = async (
    sources: Array<{
      key: string;
      label: string;
      dataCallback: () => Promise<Array<T> | undefined> | undefined;
    }>,
  ) => {
    this.sources = sources;
    REPORTING_SOURCES.push(...sources);
  };

  getReport = async (config: Partial<ReportConfig>) => {
    if (!config || !this.sources) {
      throw new Error('Run init first!');
    }
    const selectedSourcesValues: Array<T> | undefined = await this.loadSource(this.sources, config);
    if (selectedSourcesValues && config.pipes?.length) {
      const reportPipes = config.pipes.map((pipe) => pipeFromConfig(pipe));
      if (reportPipes.length) {
        const chartDatas = reportPipes.reduce(
          (
            chartDataValues: Array<{
              label: string;
              source: Array<unknown>;
              result: Array<AggregationResult<unknown, number, SimpleResult<number>>>;
            }>,
            reportPipe,
          ) => {
            if (reportPipe) {
              chartDataValues.push(
                aggregationPipe(
                  config.label ||
                    this.sources.find(({ key }) => config.sources?.length && key === config.sources[0].name)?.label ||
                    'Report',
                  selectedSourcesValues,
                  reportPipe,
                ),
              );
            }
            return chartDataValues;
          },
          [],
        );
        if (chartDatas.some((chartData) => chartData.result.some(({ result }) => !!result))) {
          const combinedChartData = chartDatas.reduce(
            (
              a: Array<AggregationResult<unknown, number, SimpleResult<number>>>,
              chartData: {
                label: string;
                source: Array<unknown>;
                result: Array<AggregationResult<unknown, number, SimpleResult<number>>>;
              },
            ) => {
              if (chartData.result.some(({ result }) => !!result)) {
                a.push(...chartData.result);
              }
              return a;
            },
            [],
          );
          return {
            label: config.label,
            result: combinedChartData,
          };
        }
      }
    }
  };
}

export default ClientSideReporting;
