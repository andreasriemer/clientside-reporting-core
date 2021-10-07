export interface ReportingSource<T extends Record<string, unknown>> {
  key: string;
  label: string;
  dataCallback: (variables?: Record<string, unknown>) => Promise<Array<T> | undefined> | undefined;
}
