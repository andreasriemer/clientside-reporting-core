/* eslint-disable @typescript-eslint/no-explicit-any */
import AggregationResult from '../interfaces/AggregationResult';
import { ReportingPipe } from '../interfaces/ReportingPipe';
import { ListResult, SimpleResult } from '../interfaces/Result';
import isTypeOf from './helper/isTypeOf';

const aggregationPipe = <T>(
  label: string,
  source: Array<T>,
  pipe: ReportingPipe<T>,
): {
  label: string;
  source: Array<T>;
  result: Array<AggregationResult<any, any, SimpleResult<any>>>;
} => {
  return {
    label,
    ...(pipe.reduce(
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
              result: aggregations.map(({ aggregation, paths, label: aggregationLabel, additionalData }) =>
                aggregation(previous.result, paths, aggregationLabel || label, additionalData),
              ),
            } as any;
          }
          return {
            source,
            result: aggregations.map(({ aggregation, paths, label: aggregationLabel, additionalData }) =>
              aggregation(previous, paths, aggregationLabel || label, additionalData),
            ),
          };
          // return aggregations.map(({ aggregation, path }) => {
          //     return aggregation(source, path, label);
          // });
        }
        return previous;
      },
      source,
    ) as any),
  };
};

export default aggregationPipe;
