import type { Epic, Task } from '@/types';

export type HashEntity = { type: 'task' | 'epic'; id: string };

export function parseHashId(hash: string): string | null {
  const id = hash.replace(/^#/, '').trim();
  return id.length > 0 ? id : null;
}

export function resolveEntity(id: string, tasks: Task[], epics: Epic[]): HashEntity | null {
  if (tasks.some((task) => task.id === id)) {
    return { type: 'task', id };
  }
  if (epics.some((epic) => epic.id === id)) {
    return { type: 'epic', id };
  }
  return null;
}
