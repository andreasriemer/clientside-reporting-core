import ClientSideReporting, { REPORTING_SOURCES } from '../index';

test('ClientSideReporting - init', () => {
  new ClientSideReporting().init([
    { key: 'test', label: 'Test Label', dataCallback: () => new Promise((res) => res([])) },
  ]);
  expect(REPORTING_SOURCES.length).toBe(1);
});
