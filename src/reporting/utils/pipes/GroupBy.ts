/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregationPipeEntry } from '../../interfaces/AggregationPipeEntry';
import { Aggregation } from '../../interfaces/Aggregation';
import { ListResult, SimpleResult, AggregationResult } from '../../interfaces/Results';
import filteredListResultEntry from '../helper/filteredListResultEntry';
import valueByPath from '../helper/valueByPath';

const groupBy =
  <T, V>(): AggregationPipeEntry<T, V, ListResult<V>> =>
  (
    source: Array<T> | ListResult<T>,
    paths: Array<Array<string>>,
    _?: Array<string>,
    aggregations?: Array<Aggregation<T, V>>,
  ) => {
    return {
      source,
      result: (source as Array<any>).reduce(
        (previous: Array<AggregationResult<T, V, SimpleResult<V>>>, current: T | SimpleResult<T>) => {
          const values = valueByPath<T | SimpleResult<T>, string>(current, paths[0]);
          if (!values) {
            return previous;
          }
          const valuesList = Array.isArray(values) ? values : [values];
          return [
            ...previous,
            ...valuesList.reduce((previousValue: Array<AggregationResult<T, V, SimpleResult<V>>>, value) => {
              const index = [...previous, ...previousValue].findIndex(
                ({ result: { label } }) =>
                  label === value ||
                  aggregations?.some(({ label: aggregationLabel }) => label === `${value}${aggregationLabel || ''}`),
              );
              if (index > -1) {
                return previousValue;
              }
              return [
                ...previousValue,
                ...(aggregations?.map(
                  ({ action, paths: aggregationPaths, label: aggregationLabel, additionalData }) => {
                    return action(
                      (source as Array<any>)
                        .filter((entry) => {
                          const valueFromPath = valueByPath<any, string>(entry, paths[0]);
                          const valuesFromPath = Array.isArray(valueFromPath) ? valueFromPath : [valueFromPath];
                          return valuesFromPath.includes(value);
                        })
                        .map(filteredListResultEntry<any, any>(value, paths[0])),
                      aggregationPaths,
                      `${value}${aggregationLabel || ''}`,
                      additionalData,
                    );
                  },
                ) || []),
              ];
            }, []),
          ];
        },
        [],
      ),
    };
  };

export default groupBy;
