/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aggregation } from '../../interfaces/Aggregation';
import { AggregationPipeEntry } from '../../interfaces/AggregationPipeEntry';
import { ListResult, SimpleResult } from '../../interfaces/Result';
import filteredListResultEntry from '../helper/filteredListResultEntry';
import filteredValues from '../helper/filteredValues';

const filterValues =
  <T, V>(): AggregationPipeEntry<T, V, ListResult<V>> =>
  (
    source: Array<T> | ListResult<T>,
    paths: Array<Array<string>>,
    filterValue?: Array<string> | undefined,
    aggregations?: Array<{
      paths: Array<Array<string>>;
      aggregation: Aggregation<T, V, SimpleResult<V>>;
      additionalData?: Record<string, unknown>;
    }>,
  ) => {
    return {
      source,
      result: [
        ...(aggregations?.map(({ aggregation, paths: aggregationPaths, additionalData: aggregationAdditionalData }) => {
          return aggregation(
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
