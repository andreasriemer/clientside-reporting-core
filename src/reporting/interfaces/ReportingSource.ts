export interface ReportingSource<T extends Record<string, unknown> = Record<string, unknown>> {
  key: string;
  label: string;
  dataCallback: () => Promise<Array<T> | undefined> | undefined;
}
