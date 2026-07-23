import { useState } from 'react';

import { useAppData, useBulkArchiveCompleted } from '@/hooks/use-data';
import { useTaskDetailActions } from '@/hooks/use-task-detail-actions';
import { useTaskEvents } from '@/hooks/use-task-events';
import { hasAnyTag } from '@/lib/tags';
import { useUIStore } from '@/stores';

export function useKanbanPageState() {
  const { tasks, epics, isLoading, error, refetch } = useAppData();
  const bulkArchive = useBulkArchiveCompleted();
  const detailActions = useTaskDetailActions(tasks, epics);
  const { openCreateModal } = useUIStore();
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  let visibleTasks = tasks;
  let visibleEpics = epics;
  if (selectedTags.length > 0) {
    visibleTasks = tasks.filter((task) => hasAnyTag(task.tags, selectedTags));
    visibleEpics = []; // epics have no tags
  }

  useTaskEvents(refetch);

  function openArchiveConfirm() {
    setShowArchiveConfirm(true);
  }

  function closeArchiveConfirm(nextOpen: boolean) {
    setShowArchiveConfirm(nextOpen);
  }

  function handleArchiveAllCompleted() {
    bulkArchive.mutate();
  }

  return {
    ...detailActions,
    bulkArchive,
    epics,
    error,
    handleArchiveAllCompleted,
    isLoading,
    openArchiveConfirm,
    openCreateModal,
    refetch,
    selectedTags,
    setSelectedTags,
    showArchiveConfirm,
    tasks,
    updateArchiveConfirm: closeArchiveConfirm,
    visibleEpics,
    visibleTasks,
  };
}
