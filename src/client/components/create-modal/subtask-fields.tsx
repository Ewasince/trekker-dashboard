'use client';

import { useMemo } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { buildParentTaskOptions } from '@/components/create-modal/create-form.utils';
import type { CreateFormValues } from '@/components/create-modal/schema';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { TagsInput } from '@/components/ui/tags-input';
import { useTags } from '@/hooks/use-tags';
import type { Task } from '@/types';

interface SubtaskFieldsProps {
  form: UseFormReturn<CreateFormValues>;
  parentTasks: Task[];
}

export function SubtaskFields({ form, parentTasks }: SubtaskFieldsProps) {
  const {
    control,
    formState: { errors },
  } = form;

  const taskOptions = useMemo(() => buildParentTaskOptions(parentTasks), [parentTasks]);
  const { data: tagsData } = useTags();

  return (
    <>
      <div className="space-y-2">
        <Label>Tags</Label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagsInput
              value={field.value}
              onChange={field.onChange}
              suggestions={tagsData?.tags ?? []}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>
          Parent Task <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="parentTaskId"
          render={({ field }) => (
            <SearchableSelect
              options={taskOptions}
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? '')}
              placeholder="Select a task..."
              emptyText="No tasks found"
            />
          )}
        />
        {errors.parentTaskId?.message && (
          <p className="text-sm text-destructive">{errors.parentTaskId.message}</p>
        )}
      </div>
    </>
  );
}
