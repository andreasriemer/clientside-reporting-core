/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aggregation } from '../../interfaces/Aggregation';
import { ReportPipeConfig } from '../../interfaces/ReportConfig';
import { ReportingPipe, ReportingPipeEntry } from '../../interfaces/ReportingPipe';
import { SimpleResult } from '../../interfaces/Result';
import aggregationFromType from './aggregationFromType';
import transformationActionFromType from './transformationActionFromType';

const pipeFromConfig = <T>(config: ReportPipeConfig): ReportingPipe<T> | undefined => {
  const result = config.reduce((previous, { transformation, aggregations }) => {
    let entry: ReportingPipeEntry<T> | undefined;
    if (
      transformation?.action &&
      transformation.paths?.length &&
      aggregations?.length &&
      aggregations.some(({ aggregation, paths }) => !!aggregation && paths?.length)
    ) {
      entry = {
        transformation: {
          action: transformationActionFromType(transformation.action),
          paths: transformation.paths,
          filterValue: transformation.filterValue,
          additionalData: transformation.additionalData,
        },
        aggregations: aggregations.reduce(
          (previousAggregation, { label, aggregation, paths, additionalData }) => {
            if (aggregation && paths?.length) {
              previousAggregation.push({
                label,
                aggregation: aggregationFromType(aggregation),
                paths,
                additionalData,
              });
            }
            return [...previousAggregation];
          },
          [] as Array<{
            paths: Array<Array<string>>;
            aggregation: Aggregation<T, any, SimpleResult<any>>;
            label?: string;
            additionalData?: Record<string, unknown>;
          }>,
        ),
      };
    } else if (transformation?.action && transformation.paths?.length) {
      entry = {
        transformation: {
          action: transformationActionFromType(transformation.action),
          paths: transformation.paths,
          filterValue: transformation.filterValue,
          additionalData: transformation.additionalData,
        },
      };
    } else if (aggregations?.length && aggregations.some(({ aggregation, paths }) => !!aggregation && paths?.length)) {
      entry = {
        aggregations: aggregations.reduce(
          (previousAggregation, { label, aggregation, paths, additionalData }) => {
            if (aggregation && paths?.length) {
              previousAggregation.push({
                label,
                aggregation: aggregationFromType(aggregation),
                paths,
                additionalData,
              });
            }
            return [...previousAggregation];
          },
          [] as Array<{
            paths: Array<Array<string>>;
            aggregation: Aggregation<T, any, SimpleResult<any>>;
            label?: string;
            additionalData?: Record<string, unknown>;
          }>,
        ),
      };
    }
    if (entry) {
      previous.push(entry);
    }
    return [...previous];
  }, [] as Array<ReportingPipeEntry<T>>);
  return result.length ? result : undefined;
};

export default pipeFromConfig;
