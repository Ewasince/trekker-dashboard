import { useEffect } from 'react';

import { useUIStore } from '@/stores';

const BASE_TITLE = 'Trekker';

export function pageTitle(selectedId: string | null): string {
  if (!selectedId) {
    return BASE_TITLE;
  }
  return `${BASE_TITLE}: ${selectedId}`;
}

export function usePageTitle(): void {
  const selectedTaskId = useUIStore((state) => state.selectedTaskId);
  const selectedEpicId = useUIStore((state) => state.selectedEpicId);
  const selectedId = selectedTaskId ?? selectedEpicId;

  useEffect(() => {
    document.title = pageTitle(selectedId);
  }, [selectedId]);
}
