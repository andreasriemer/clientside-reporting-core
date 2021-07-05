import { ReportFilterComparators } from '../../interfaces/ReportConfig';
import {
  cleanDate,
  currentDate,
  currentMonthDatefilter,
  currentYearDatefilter,
  DateFilter,
  dateFromString,
  dateRangeFromString,
} from './dateUtils';
import valueByPath from './valueByPath';
import isTypeOf from './isTypeOf';

export const dateComparator =
  (comparator: ReportFilterComparators | undefined, dateFrom: Date, dateTo: Date) => (entry: Date) => {
    switch (comparator) {
      case 'lt':
        return entry.getTime() < dateFrom.getTime();
      case 'lte':
        return entry.getTime() <= dateFrom.getTime();
      case 'eq':
        return entry.getTime() === dateFrom.getTime() || entry.getTime() === dateTo.getTime();
      case 'gte':
        return entry.getTime() >= dateTo.getTime();
      case 'gt':
        return entry.getTime() > dateTo.getTime();
      default:
        return entry.getTime() > dateFrom.getTime() && entry.getTime() < dateTo.getTime();
    }
  };

const filteredValues = <T extends Record<string, unknown>>(
  source: Array<T>,
  path: Array<string>,
  filterValue?: Array<string> | undefined,
  comparator?: ReportFilterComparators,
) =>
  source.filter((entry) => {
    if (!filterValue?.length) {
      return true;
    }
    const entryValue = valueByPath<T, string>(entry, path);
    const entryValueList = Array.isArray(entryValue) ? entryValue : [entryValue];
    let dateFilter: DateFilter | undefined;
    if (filterValue && filterValue[0] === 'currentMonthDatefilter') {
      dateFilter = currentMonthDatefilter();
    }
    if (filterValue && filterValue[0] === 'currentYearDatefilter') {
      dateFilter = currentYearDatefilter();
    }
    if (filterValue) {
      const dateRange = dateRangeFromString(filterValue[0]);
      if (dateRange) {
        const { dateFrom, dateTo } = dateRange;
        dateFilter = {
          dateFrom: cleanDate(dateFrom, {
            hours: 0,
            minutes: 0,
            seconds: 0,
            ms: 0,
          }),
          dateTo: cleanDate(dateTo, {
            hours: 23,
            minutes: 59,
            seconds: 59,
            ms: 999,
          }),
        };
      }
    } else if (filterValue && isTypeOf<Date>(dateFromString(filterValue[0], null), 'getTime')) {
      const firstDateFromString = dateFromString(filterValue[0], null);
      if (firstDateFromString && !Number.isNaN(firstDateFromString.getTime())) {
        dateFilter = {
          dateFrom: cleanDate(dateFromString(filterValue[0]), {
            hours: 0,
            minutes: 0,
            seconds: 0,
            ms: 0,
          }),
          dateTo: filterValue[1]
            ? cleanDate(dateFromString(filterValue[1]), {
                hours: 23,
                minutes: 59,
                seconds: 59,
                ms: 999,
              })
            : cleanDate(currentDate(undefined, 'end')),
        };
      }
    }
    if (dateFilter) {
      const entryDates = entryValueList.reduce((previousListEntry: Array<Date>, listEntry) => {
        const listEntryDate = dateFromString(listEntry);
        if (listEntryDate) {
          previousListEntry.push(listEntryDate);
        }
        return previousListEntry;
      }, []);
      if (entryDates && dateFilter.dateFrom && dateFilter.dateTo) {
        const dateFrom = dateFromString(dateFilter.dateFrom);
        const dateTo = dateFromString(dateFilter.dateTo);
        if (dateFrom && dateTo) {
          return entryDates.some(dateComparator(comparator, dateFrom, dateTo));
        }
      }
    }
    return entryValueList.some((listEntry) => filterValue.includes(listEntry));
  });

export default filteredValues;
