export interface ReportingSource<T extends object = object> {
  key: string;
  label: string;
  valueMapping?: Record<
    string,
    {
      label: string;
      map: (value: T) => T;
    }
  >;
  dataCallback: (variables?: any) => Promise<Array<T> | undefined> | undefined;
}
