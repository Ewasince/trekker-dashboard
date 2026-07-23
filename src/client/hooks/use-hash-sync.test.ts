import { describe, expect, test } from 'bun:test';

import type { Epic, Task } from '@/types';

import { parseHashId, resolveEntity } from './use-hash-sync';

const task = { id: 'TREK-5' } as unknown as Task;
const subtask = { id: 'TREK-9', parentTaskId: 'TREK-5' } as unknown as Task;
const epic = { id: 'EPIC-2' } as unknown as Epic;

describe('parseHashId', () => {
  test('strips leading # and returns id', () => {
    expect(parseHashId('#TREK-5')).toBe('TREK-5');
  });

  test('empty or bare-hash → null', () => {
    expect(parseHashId('')).toBeNull();
    expect(parseHashId('#')).toBeNull();
  });
});

describe('resolveEntity', () => {
  const tasks = [task, subtask];
  const epics = [epic];

  test('resolves a task id as task', () => {
    expect(resolveEntity('TREK-5', tasks, epics)).toEqual({ type: 'task', id: 'TREK-5' });
  });

  test('resolves a subtask id as task', () => {
    expect(resolveEntity('TREK-9', tasks, epics)).toEqual({ type: 'task', id: 'TREK-9' });
  });

  test('resolves an epic id as epic', () => {
    expect(resolveEntity('EPIC-2', tasks, epics)).toEqual({ type: 'epic', id: 'EPIC-2' });
  });

  test('unknown id → null', () => {
    expect(resolveEntity('NOPE-1', tasks, epics)).toBeNull();
  });
});
