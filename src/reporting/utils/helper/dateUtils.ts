export interface DateFilter {
  dateFrom?: string;
  dateTo?: string;
}

export const currentDate = (delta = 0, treshold: 'default' | 'start' | 'end' = 'default'): Date => {
  const now = new Date();
  const [year, month, date, hours, minutes] = [
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
  ];
  const timezoneDate = new Date(year, month, date + delta, hours, minutes);
  const _TimezoneOffset = timezoneDate.getTimezoneOffset();
  const deltaDate = () => {
    return new Date(new Date().setDate(Number(date) + delta));
  };

  switch (treshold) {
    case 'default':
      return deltaDate();
    case 'start':
      return new Date(Number(year), Number(month), Number(date) + delta, 0, 0 - _TimezoneOffset, 0);
    case 'end':
      return new Date(Number(year), Number(month), Number(date) + delta, 23, 59 - _TimezoneOffset, 59);
    default:
      return deltaDate();
  }
};

export const parseDateFromString = (dateString: string) => {
  try {
    const now = new Date();
    let splitted = dateString.split('-');
    let [year, month, date] = splitted;
    if (dateString.includes('.')) {
      splitted = dateString.split('.');
      [date, month, year] = splitted;
    }
    if (year.length < 4) {
      year = `${now
        .getFullYear()
        .toString()
        .slice(0, 4 - year.length)}${year}`;
    }
    const result = new Date(Number(year), Number(month) - 1, Number(date));
    if (!Number.isNaN(result.getTime())) {
      return result;
    }
    return undefined;
  } catch (__) {
    return undefined;
  }
};

export const dateFromString = (dateString: string, fallback: Date | null = new Date()) => {
  try {
    return parseDateFromString(dateString) || new Date(dateString);
  } catch (_) {
    return fallback;
  }
};

export const dateRangeFromString = (dateString: string, fallback?: { dateFrom: Date; dateTo: Date } | null) => {
  try {
    const [from, to] = dateString.split(' - ');
    const dateFrom = dateFromString(from, null);
    const dateTo = dateFromString(to, null);
    if (dateFrom && dateTo && !Number.isNaN(dateFrom.getTime()) && !Number.isNaN(dateTo.getTime())) {
      return {
        dateFrom,
        dateTo,
      };
    }
    return fallback;
  } catch (_) {
    return fallback;
  }
};

export const cleanDate = (
  date: Date | null | undefined | string,
  options?: {
    year?: number;
    month?: number;
    date?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    ms?: number;
  },
): string => {
  const originDate = typeof date === 'string' ? dateFromString(date) || new Date() : date || new Date();
  const [_Year, _Month, _Date, _Hours, _Minutes, _Seconds, _Milliseconds] = [
    originDate.getFullYear(),
    originDate.getMonth(),
    originDate.getDate(),
    originDate.getHours(),
    originDate.getMinutes(),
    originDate.getSeconds(),
    originDate.getMilliseconds(),
  ];
  const timezoneDate = new Date(
    options?.year != null ? options.year : _Year,
    options?.month != null ? options.month : _Month,
    options?.date != null ? options.date : _Date,
    options?.hours != null ? options.hours : _Hours,
    options?.minutes != null ? options.minutes : _Minutes,
    options?.seconds != null ? options.seconds : _Seconds,
    options?.ms != null ? options.ms : _Milliseconds,
  );
  const _TimezoneOffset = timezoneDate.getTimezoneOffset();
  return new Date(
    options?.year != null ? options.year : _Year,
    options?.month != null ? options.month : _Month,
    options?.date != null ? options.date : _Date,
    options?.hours != null ? options.hours : _Hours,
    options?.minutes != null ? options.minutes - _TimezoneOffset : _Minutes,
    options?.seconds != null ? options.seconds : _Seconds,
    options?.ms != null ? options.ms : _Milliseconds,
  ).toISOString();
};

export const currentMonthDate = (
  delta = 0,
  treshold: 'default' | 'start' | 'end' = 'default',
  date?: Date | string,
): string => {
  const now = typeof date === 'string' ? dateFromString(date) || new Date() : date || new Date();
  const [month] = [now.getMonth()];

  switch (treshold) {
    case 'default':
      return cleanDate(date, { month: Number(month) + delta });
    case 'start':
      return cleanDate(date, {
        month: Number(month) + delta,
        date: 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
        ms: 0,
      });
    case 'end':
      return cleanDate(date, {
        month: Number(month) + delta + 1,
        date: 0,
        hours: 23,
        minutes: 59,
        seconds: 59,
        ms: 999,
      });
    default:
      return cleanDate(date, { month: Number(month) + delta });
  }
};

export const currentYearDate = (delta = 0, treshold: 'default' | 'start' | 'end' = 'default', date?: Date): string => {
  const now = date || new Date();
  const [year] = [now.getFullYear()];

  switch (treshold) {
    case 'default':
      return cleanDate(date, { year: Number(year) + delta });
    case 'start':
      return cleanDate(date, {
        year: Number(year) + delta,
        month: 0,
        date: 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
        ms: 0,
      });
    case 'end':
      return cleanDate(date, {
        year: Number(year) + delta,
        month: 12,
        date: 0,
        hours: 23,
        minutes: 59,
        seconds: 59,
        ms: 999,
      });
    default:
      return cleanDate(date, { year: Number(year) + delta });
  }
};

export const currentMonthDatefilter = (): DateFilter => {
  const dateFrom = currentMonthDate(undefined, 'start');
  const dateTo = currentMonthDate(undefined, 'end');
  return {
    dateFrom,
    dateTo,
  };
};

export const currentYearDatefilter = (): DateFilter => {
  const dateFrom = cleanDate(undefined, { month: 0 });
  const dateTo = cleanDate(undefined, { month: 11 });
  return {
    dateFrom,
    dateTo,
  };
};

export const formatedDateString = (
  forDate?: Date | string | null,
  hideTime?: boolean,
  options?: { ignoreTimezone?: boolean },
): string => {
  const date = typeof forDate === 'string' ? dateFromString(cleanDate(forDate)) : forDate;
  if (date && !options?.ignoreTimezone) {
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  }
  return (
    date?.toLocaleString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: hideTime ? undefined : 'numeric',
      minute: hideTime ? undefined : 'numeric',
    }) || ''
  );
};
