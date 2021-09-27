/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aggregation } from '../../interfaces/Aggregation';
import { AggregationPipeEntry } from '../../interfaces/AggregationPipeEntry';
import { ListResult, SimpleResult } from '../../interfaces/Results';
import filteredListResultEntry from '../helper/filteredListResultEntry';
import filteredValues from '../helper/filteredValues';

const filterValues =
  <T, V>(): AggregationPipeEntry<T, V, ListResult<V>> =>
  (
    source: Array<T> | ListResult<T>,
    paths: Array<Array<string>>,
    filterValue?: Array<string> | undefined,
    aggregations?: Array<Aggregation<T, V>>,
  ) => {
    return {
      source,
      result: [
        ...(aggregations?.map(({ action, paths: aggregationPaths, additionalData: aggregationAdditionalData }) => {
          return action(
            filteredValues(source as Array<any>, paths[0], filterValue).map(
              filteredListResultEntry<string, any>(filterValue, paths[0]),
            ),
            aggregationPaths,
            aggregationPaths.join('.'),
            aggregationAdditionalData,
          );
        }) ||
          filteredValues(source as Array<any>, paths[0], filterValue).map(
            filteredListResultEntry<string, any>(filterValue, paths[0]),
          )),
      ],
    };
  };

export default filterValues;
