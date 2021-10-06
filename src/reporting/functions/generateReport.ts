import { AggregationResult, SimpleResult } from './../interfaces/Results';
import { ReportingSource } from './../interfaces/ReportingSource';
import { ReportConfig } from './../interfaces/ReportConfig';
import pipeFromConfig from './pipeFromConfig';
import { aggregationPipe } from '../utils';

const generateReport = async <T extends Record<string, unknown>>(
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

export default generateReport;
