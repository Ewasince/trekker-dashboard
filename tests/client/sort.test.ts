import { describe, expect, it } from 'bun:test';

import { compareByKeys, type SortKey } from '@/lib/sort';

interface Row {
  id: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  title: string;
}

function row(id: string, priority: number, createdAt: string): Row {
  return { id, priority, createdAt, updatedAt: createdAt, title: id };
}

function sortIds(rows: Row[], keys: SortKey[]): string[] {
  return [...rows].sort((a, b) => compareByKeys(a, b, keys)).map((r) => r.id);
}

describe('compareByKeys', () => {
  it('sorts by priority, then created ascending as a tiebreaker', () => {
    const rows = [
      row('a', 1, '2024-01-03'),
      row('b', 0, '2024-01-02'),
      row('c', 1, '2024-01-01'),
      row('d', 0, '2024-01-04'),
    ];
    const keys: SortKey[] = [
      { field: 'priority', dir: 'asc' },
      { field: 'created', dir: 'asc' },
    ];
    // priority 0 first (b before d by date), then priority 1 (c before a by date)
    expect(sortIds(rows, keys)).toEqual(['b', 'd', 'c', 'a']);
  });

  it('respects direction per key', () => {
    const rows = [row('a', 0, '2024-01-01'), row('b', 0, '2024-01-02')];
    expect(sortIds(rows, [{ field: 'created', dir: 'desc' }])).toEqual(['b', 'a']);
    expect(sortIds(rows, [{ field: 'created', dir: 'asc' }])).toEqual(['a', 'b']);
  });

  it('keeps original (stable) order when all keys tie', () => {
    const rows = [row('a', 2, '2024-01-01'), row('b', 2, '2024-01-01')];
    expect(sortIds(rows, [{ field: 'priority', dir: 'asc' }])).toEqual(['a', 'b']);
  });

  it('with no keys leaves order unchanged', () => {
    const rows = [row('b', 1, '2024-01-01'), row('a', 0, '2024-01-01')];
    expect(sortIds(rows, [])).toEqual(['b', 'a']);
  });
});
