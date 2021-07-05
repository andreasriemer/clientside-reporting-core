/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReportConfig } from '../../interfaces/ReportConfig';
import isDuplicateValue from './isDuplicateValue';
import valueByPath from './valueByPath';

const combineSources = <T>(
  sourceValues: Array<{
    key: string;
    label: string;
    values: Array<unknown> | undefined;
  }>,
  reportConfig: Partial<ReportConfig>,
): Array<T> => {
  if (sourceValues.length > 1) {
    const result = sourceValues.reduce((values: Array<any>, sourceValue) => {
      const valuesCopy = [...values];
      const config = reportConfig.sources?.find(({ name }) => name === sourceValue.key);
      if (config?.mappingPath && sourceValue.values?.length) {
        const { srcPath, dstPath } = config.mappingPath;
        sourceValue.values.forEach((value) => {
          const combinationData: { unique: Array<number>; all: Array<number> } = valuesCopy.reduce(
            (
              previousCombinationData: {
                unique: Array<number>;
                all: Array<number>;
              },
              currentDstValue,
              currentDstValueIndex,
            ) => {
              const dstValueFromPath = valueByPath(currentDstValue, dstPath);
              const srcValueFromPath = valueByPath(value, srcPath);
              const dstValueList = Array.isArray(dstValueFromPath) ? dstValueFromPath : [dstValueFromPath];
              const srcValueList = Array.isArray(srcValueFromPath) ? srcValueFromPath : [srcValueFromPath];
              if (dstValueList.some((dstValue) => srcValueList.some((srcValue) => dstValue === srcValue))) {
                if (!isDuplicateValue(currentDstValue, valuesCopy, dstPath)) {
                  previousCombinationData.unique.push(currentDstValueIndex);
                }
                previousCombinationData.all.push(currentDstValueIndex);
              }
              return previousCombinationData;
            },
            { unique: [], all: [] },
          );
          if (combinationData.unique.length || combinationData.all.length) {
            combinationData.unique.forEach((uniqueCombinationIndex) => {
              if (valuesCopy[uniqueCombinationIndex] && valuesCopy[uniqueCombinationIndex][sourceValue.key]) {
                valuesCopy.push({
                  ...valuesCopy[uniqueCombinationIndex],
                  [sourceValue.key]: value,
                });
              } else {
                valuesCopy[uniqueCombinationIndex][sourceValue.key] = value;
              }
            });
            combinationData.all.forEach((allCombinationIndex) => {
              if (!valuesCopy[allCombinationIndex] || !valuesCopy[allCombinationIndex][sourceValue.key]) {
                valuesCopy[allCombinationIndex][sourceValue.key] = value;
              }
            });
          } else {
            valuesCopy.push({
              [sourceValue.key]: value,
            });
          }
        });
      } else if (
        sourceValue.values?.length &&
        reportConfig.sources?.length &&
        sourceValue.key === reportConfig.sources[0].name
      ) {
        valuesCopy.push(
          ...sourceValue.values.map((entry: any) => ({
            [sourceValue.key]: { ...entry },
          })),
        );
      }
      return valuesCopy;
    }, []);
    return result;
  }
  return (
    (sourceValues[0]?.values?.map((entry) => ({
      [sourceValues[0].key]: { ...(entry as Record<string, unknown>) },
    })) as unknown as Array<T>) || []
  );
};

export default combineSources;
