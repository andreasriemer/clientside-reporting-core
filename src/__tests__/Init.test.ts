import { loadSourceValues, KNOWN_SOURCE_NAMES } from '../index';

test('ClientSideReporting - init', () => {
  loadSourceValues<{ key: string }>(
    [{ key: 'test', label: 'Test Label', dataCallback: () => new Promise((res) => res([{ key: 'string' }])) }],
    {
      sources: [{ name: 'test' }],
    },
  );
  expect(KNOWN_SOURCE_NAMES.length).toBe(1);
});
