import { ReportResultEntry, ReportData } from './../interfaces/Results';
import { ReportingSource } from './../interfaces/ReportingSource';
import { ReportConfig } from './../interfaces/ReportConfig';
import pipeFromConfig from './pipeFromConfig';
import { aggregationPipe } from '../utils';

const generateReport = async <T extends Record<string, unknown>>(
  sourcesValues: Array<T>,
  config: Partial<ReportConfig>,
  sources?: Array<Omit<ReportingSource<T>, 'dataCallback'>>,
): Promise<ReportData<T> | undefined> => {
  const reportPipes = config.pipes?.map((pipe) => pipeFromConfig<T>(pipe));
  if (reportPipes?.length) {
    const results = reportPipes.reduce((resultEntries: Array<ReportResultEntry<T>>, reportPipe) => {
      if (reportPipe) {
        const resultEntry: ReportResultEntry<T> = {
          _id: reportPipe._id,
          ...aggregationPipe<T>(
            reportPipe.label ||
              sources?.find(({ key }) => config.sources?.length && key === config.sources[0].name)?.label ||
              config.label ||
              'Report',
            sourcesValues,
            reportPipe.actions,
          ),
        };
        resultEntries.push(resultEntry);
      }
      return resultEntries;
    }, []);
    return {
      _id: config._id,
      label: config.label,
      results,
    };
  }
};

export default generateReport;
