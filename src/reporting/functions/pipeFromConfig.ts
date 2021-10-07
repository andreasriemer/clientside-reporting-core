/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aggregation } from '../interfaces/Aggregation';
import { ReportPipeConfig } from '../interfaces/ReportConfig';
import { ReportingPipeEntry } from '../interfaces/ReportingPipe';
import aggregationFromType from '../utils/helper/aggregationFromType';
import transformationActionFromType from '../utils/helper/transformationActionFromType';

const pipeFromConfig = <T>(config: ReportPipeConfig): ReportingPipeEntry<T> | undefined => {
  const entry: ReportingPipeEntry<T> = {
    _id: config._id,
    label: config.label,
    actions: [],
  };
  config.actions.forEach(({ transformation, aggregations }) => {
    if (
      transformation?.action &&
      transformation.paths?.length &&
      aggregations?.length &&
      aggregations.some(({ action, paths }) => !!action && paths?.length)
    ) {
      entry.actions.push({
        transformation: {
          _id: transformation._id,
          action: transformationActionFromType(transformation.action),
          paths: transformation.paths,
          filterValue: transformation.filterValue,
          additionalData: transformation.additionalData,
        },
        aggregations: aggregations.reduce((previousAggregation: Array<Aggregation<T, any>>, aggregation) => {
          if (aggregation.action && aggregation.paths?.length) {
            previousAggregation.push({
              _id: aggregation._id,
              label: aggregation.label,
              action: aggregationFromType(aggregation.action),
              paths: aggregation.paths,
              additionalData: aggregation.additionalData,
            });
          }
          return [...previousAggregation];
        }, []),
      });
    } else if (transformation?.action && transformation.paths?.length) {
      entry.actions.push({
        transformation: {
          _id: transformation._id,
          action: transformationActionFromType(transformation.action),
          paths: transformation.paths,
          filterValue: transformation.filterValue,
          additionalData: transformation.additionalData,
        },
      });
    } else if (aggregations?.length && aggregations.some(({ action, paths }) => !!action && paths?.length)) {
      entry.actions.push({
        aggregations: aggregations.reduce((previousAggregation: Array<Aggregation<T, any>>, aggregation) => {
          if (aggregation.action && aggregation.paths?.length) {
            previousAggregation.push({
              _id: aggregation._id,
              label: aggregation.label,
              action: aggregationFromType(aggregation.action),
              paths: aggregation.paths,
              additionalData: aggregation.additionalData,
            });
          }
          return [...previousAggregation];
        }, []),
      });
    }
  });
  return entry;
};

export default pipeFromConfig;
