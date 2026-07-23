'use client';

import { ArrowDown, ArrowUp, Plus, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { NativePopover } from '@/components/ui/native-popover';
import {
  directionLabel,
  SORT_FIELDS,
  type SortDirection,
  type SortField,
  type SortKey,
} from '@/lib/sort';

export type TypeFilter = 'all' | 'epic' | 'task';

export interface ColumnFilterState {
  sort: SortKey[];
  type: TypeFilter;
}

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'epic', label: 'Epics only' },
  { value: 'task', label: 'Tasks only' },
];

export const DEFAULT_FILTER: ColumnFilterState = {
  sort: [{ field: 'created', dir: 'desc' }],
  type: 'all',
};

function sameSort(a: SortKey[], b: SortKey[]): boolean {
  return (
    a.length === b.length && a.every((key, i) => key.field === b[i].field && key.dir === b[i].dir)
  );
}

function isFilterActive(filter: ColumnFilterState): boolean {
  return !sameSort(filter.sort, DEFAULT_FILTER.sort) || filter.type !== DEFAULT_FILTER.type;
}

interface ColumnFilterProps {
  value: ColumnFilterState;
  onChange: (value: ColumnFilterState) => void;
}

const nativeSelectStyles =
  'h-8 rounded-md border bg-transparent px-2 text-sm outline-none focus:ring-1 focus:ring-ring';

export function ColumnFilter({ value, onChange }: ColumnFilterProps) {
  const [open, setOpen] = useState(false);
  const active = isFilterActive(value);

  const setSort = (sort: SortKey[]) => onChange({ ...value, sort });

  const updateKey = (index: number, patch: Partial<SortKey>) => {
    setSort(
      value.sort.map((key, i) => {
        if (i !== index) return key;
        return { ...key, ...patch };
      })
    );
  };

  const removeKey = (index: number) => {
    setSort(value.sort.filter((_, i) => i !== index));
  };

  const moveKey = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.sort.length) return;
    const next = [...value.sort];
    [next[index], next[target]] = [next[target], next[index]];
    setSort(next);
  };

  const usedFields = new Set(value.sort.map((key) => key.field));
  const availableField = SORT_FIELDS.find((field) => !usedFields.has(field.value));

  const addKey = () => {
    if (!availableField) return;
    setSort([...value.sort, { field: availableField.value, dir: 'desc' }]);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => setOpen(!open)}
        title="Sort & filter"
      >
        <SlidersHorizontal className="h-4 w-4" />
        {active && <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-blue-500" />}
      </Button>

      <NativePopover
        open={open}
        onClose={() => setOpen(false)}
        className="w-64 flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Sort by</label>

          {value.sort.map((key, index) => (
            <div key={key.field} className="flex items-center gap-1">
              <select
                value={key.field}
                onChange={(e) => updateKey(index, { field: e.target.value as SortField })}
                className={`${nativeSelectStyles} flex-1`}
              >
                {SORT_FIELDS.filter(
                  (field) => field.value === key.field || !usedFields.has(field.value)
                ).map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>
              <select
                value={key.dir}
                onChange={(e) => updateKey(index, { dir: e.target.value as SortDirection })}
                className={`${nativeSelectStyles} flex-1`}
              >
                {(['desc', 'asc'] as SortDirection[]).map((dir) => (
                  <option key={dir} value={dir}>
                    {directionLabel(key.field, dir)}
                  </option>
                ))}
              </select>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-6 shrink-0"
                disabled={index === 0}
                onClick={() => moveKey(index, -1)}
                title="Move up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-6 shrink-0"
                disabled={index === value.sort.length - 1}
                onClick={() => moveKey(index, 1)}
                title="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-6 shrink-0"
                onClick={() => removeKey(index)}
                title="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}

          {availableField && (
            <button
              onClick={addKey}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground self-start"
            >
              <Plus className="h-3.5 w-3.5" />
              Add sort
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Show</label>
          <select
            value={value.type}
            onChange={(e) => {
              const type = e.target.value;
              if (TYPE_OPTIONS.some((opt) => opt.value === type)) {
                onChange({ ...value, type: type as TypeFilter });
              }
            }}
            className={`${nativeSelectStyles} w-full`}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {active && (
          <button
            onClick={() => {
              onChange(DEFAULT_FILTER);
              setOpen(false);
            }}
            className="text-xs text-muted-foreground hover:text-foreground underline self-end"
          >
            Reset
          </button>
        )}
      </NativePopover>
    </div>
  );
}
