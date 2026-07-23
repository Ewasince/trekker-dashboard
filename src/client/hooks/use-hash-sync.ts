import { useEffect } from 'react';

import { useUIStore } from '@/stores';
import type { Epic, Task } from '@/types';

export interface HashEntity {
  type: 'task' | 'epic';
  id: string;
}

export function parseHashId(hash: string): string | null {
  const id = hash.replace(/^#/, '').trim();
  if (id.length > 0) {
    return id;
  }
  return null;
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

function currentHashBaseUrl(): string {
  return `${window.location.pathname}${window.location.search}`;
}

export function useHashSync(tasks: Task[], epics: Epic[]): void {
  const selectedTaskId = useUIStore((state) => state.selectedTaskId);
  const selectedEpicId = useUIStore((state) => state.selectedEpicId);
  const selectedId = selectedTaskId ?? selectedEpicId;

  // Direction A: external hash change (deep link on mount, manual edit, back/forward) -> store.
  useEffect(() => {
    function applyHash() {
      const store = useUIStore.getState();
      const hashId = parseHashId(window.location.hash);

      if (!hashId) {
        if (store.selectedTaskId) {
          store.closeTaskDetail();
        }
        if (store.selectedEpicId) {
          store.closeEpicDetail();
        }
        return;
      }

      const resolved = resolveEntity(hashId, tasks, epics);
      if (!resolved) {
        return; // unknown id, or data not loaded yet — retries when tasks/epics change
      }
      if (resolved.type === 'task') {
        store.openTaskDetail(resolved.id);
      } else {
        store.openEpicDetail(resolved.id);
      }
    }

    applyHash(); // handle initial mount (hashchange does not fire on first load)
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [tasks, epics]);

  // Direction B: selection change -> hash, via replaceState (does NOT emit hashchange).
  useEffect(() => {
    const current = parseHashId(window.location.hash);
    if (current === selectedId) {
      return;
    }
    // Keep an unresolved deep-link hash while data is still loading.
    if (!selectedId && current && !resolveEntity(current, tasks, epics)) {
      return;
    }
    const base = currentHashBaseUrl();
    let url = base;
    if (selectedId) {
      url = `${base}#${selectedId}`;
    }
    window.history.replaceState(window.history.state, '', url);
  }, [selectedId, tasks, epics]);
}
