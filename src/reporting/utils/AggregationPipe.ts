import { ReportingPipeAction } from '../interfaces/ReportingPipe';
import { ListResult, SimpleResult, AggregationResult } from '../interfaces/Results';
import isTypeOf from './helper/isTypeOf';

const aggregationPipe = <T>(
  label: string,
  source: Array<T>,
  actions: Array<ReportingPipeAction<T>>,
): {
  label: string;
  source: Array<T>;
  result: Array<AggregationResult<any, any, SimpleResult<any>>>;
} => {
  const x = actions.reduce(
    (previous: Array<T> | AggregationResult<T, any, ListResult<any>>, { transformation, aggregations }) => {
      if (transformation) {
        const { action, paths, filterValue } = transformation;
        if (isTypeOf<AggregationResult<T, any, ListResult<any>>>(previous, 'result')) {
          return action(previous.result, paths, filterValue, aggregations);
        }
        return action(previous, paths, filterValue, aggregations);
      }
      if (aggregations) {
        if (isTypeOf<AggregationResult<T, any, ListResult<any>>>(previous, 'result')) {
          return {
            source: previous.result,
            result: aggregations.map(({ action, paths, label: aggregationLabel, additionalData }) =>
              action(previous.result, paths, aggregationLabel || label, additionalData),
            ),
          } as any;
        }
        return {
          source,
          result: aggregations.map(({ action, paths, label: aggregationLabel, additionalData }) =>
            action(previous, paths, aggregationLabel || label, additionalData),
          ),
        };
      }
      return previous;
    },
    source,
  ) as any;
  return {
    label,
    ...x,
  };
};

export default aggregationPipe;
