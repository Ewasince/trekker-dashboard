'use client';

import { KanbanBoard } from '@/components/kanban';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { TagsInput } from '@/components/ui/tags-input';
import { useTags } from '@/hooks/use-tags';
import { getErrorMessage } from '@/lib/errors';
import { parseTagList } from '@/lib/tags';
import { EntityDetailModals } from '@/pages/entity-detail-modals';
import { useKanbanPageState } from '@/pages/use-kanban-page-state';

export function KanbanPage() {
  const {
    closeEpicDetail,
    closeTaskDetail,
    epics,
    error,
    handleArchiveAllCompleted,
    handleEpicModalTaskClick,
    isLoading,
    openArchiveConfirm,
    openCreateModal,
    openEpicDetail,
    openTaskDetail,
    refetch,
    selectedEpic,
    selectedEpicTasks,
    selectedTags,
    selectedTask,
    setSelectedTags,
    showArchiveConfirm,
    tasks,
    updateArchiveConfirm,
    visibleEpics,
    visibleTasks,
  } = useKanbanPageState();

  const { data: tagsData } = useTags();
  const tagSuggestions = tagsData?.tags ?? [];

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center flex-1">
        <span className="text-destructive">Error: {getErrorMessage(error, 'Unknown error')}</span>
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 p-4 overflow-x-auto">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tags</span>
          <TagsInput
            value={selectedTags.join(', ')}
            onChange={(value) => setSelectedTags(parseTagList(value))}
            suggestions={tagSuggestions}
            placeholder="Filter tags..."
            className="w-72"
          />
        </div>
        <KanbanBoard
          tasks={visibleTasks}
          epics={visibleEpics}
          onAddClick={(status) => openCreateModal({ status })}
          onTaskClick={(task) => openTaskDetail(task.id)}
          onEpicClick={(epic) => openEpicDetail(epic.id)}
          onArchiveAllCompleted={openArchiveConfirm}
        />
      </main>

      <ConfirmDialog
        open={showArchiveConfirm}
        onOpenChange={updateArchiveConfirm}
        title="Archive All Completed"
        description="This will move all completed tasks and epics to the archived status. This action can be undone by manually changing their status back."
        confirmLabel="Archive All"
        onConfirm={handleArchiveAllCompleted}
      />

      <EntityDetailModals
        allTasks={tasks}
        epics={epics}
        selectedEpic={selectedEpic}
        selectedEpicTasks={selectedEpicTasks}
        selectedTask={selectedTask}
        onCloseEpicDetail={closeEpicDetail}
        onCloseTaskDetail={closeTaskDetail}
        onEpicDetailTaskClick={handleEpicModalTaskClick}
        onTaskDetailEpicClick={(epic) => {
          closeTaskDetail();
          openEpicDetail(epic.id);
        }}
        onTaskDetailTaskClick={(task) => openTaskDetail(task.id)}
        onUpdate={refetch}
      />
    </>
  );
}
