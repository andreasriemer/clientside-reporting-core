/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregationAction } from '../../interfaces/Aggregation';
import { ReportPipeConfig } from '../../interfaces/ReportConfig';
import { ReportingPipe, ReportingPipeEntry } from '../../interfaces/ReportingPipe';
import { SimpleResult } from '../../interfaces/Results';
import aggregationFromType from './aggregationFromType';
import transformationActionFromType from './transformationActionFromType';

const pipeFromConfig = <T>(config: ReportPipeConfig): ReportingPipe<T> | undefined => {
  const result = config.reduce((previous, { transformation, aggregations }) => {
    let entry: ReportingPipeEntry<T> | undefined;
    if (
      transformation?.action &&
      transformation.paths?.length &&
      aggregations?.length &&
      aggregations.some(({ action, paths }) => !!action && paths?.length)
    ) {
      entry = {
        transformation: {
          action: transformationActionFromType(transformation.action),
          paths: transformation.paths,
          filterValue: transformation.filterValue,
          additionalData: transformation.additionalData,
        },
        aggregations: aggregations.reduce(
          (previousAggregation, { label, action, paths, additionalData }) => {
            if (action && paths?.length) {
              previousAggregation.push({
                label,
                action: aggregationFromType(action),
                paths,
                additionalData,
              });
            }
            return [...previousAggregation];
          },
          [] as Array<{
            paths: Array<Array<string>>;
            action: AggregationAction<T, any, SimpleResult<any>>;
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
    } else if (aggregations?.length && aggregations.some(({ action, paths }) => !!action && paths?.length)) {
      entry = {
        aggregations: aggregations.reduce(
          (previousAggregation, { label, action, paths, additionalData }) => {
            if (action && paths?.length) {
              previousAggregation.push({
                label,
                action: aggregationFromType(action),
                paths,
                additionalData,
              });
            }
            return [...previousAggregation];
          },
          [] as Array<{
            paths: Array<Array<string>>;
            action: AggregationAction<T, any, SimpleResult<any>>;
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
