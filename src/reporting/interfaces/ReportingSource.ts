export interface ReportingSource<T extends Record<string, unknown>> {
  key: string;
  label: string;
  dataCallback: (variables?: any) => Promise<Array<T> | undefined> | undefined;
}
