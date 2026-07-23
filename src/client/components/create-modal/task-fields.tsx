'use client';

import { useMemo } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { buildEpicOptions } from '@/components/create-modal/create-form.utils';
import type { CreateFormValues } from '@/components/create-modal/schema';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { TagsInput } from '@/components/ui/tags-input';
import { useTags } from '@/hooks/use-tags';
import type { Epic } from '@/types';

interface TaskFieldsProps {
  form: UseFormReturn<CreateFormValues>;
  epics: Epic[];
}

export function TaskFields({ form, epics }: TaskFieldsProps) {
  const { control } = form;

  const epicOptions = useMemo(() => buildEpicOptions(epics), [epics]);
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
        <Label>Epic</Label>
        <Controller
          control={control}
          name="epicId"
          render={({ field }) => (
            <SearchableSelect
              options={epicOptions}
              value={field.value}
              onValueChange={field.onChange}
              placeholder="No Epic"
              emptyText="No epics found"
            />
          )}
        />
      </div>
    </>
  );
}
