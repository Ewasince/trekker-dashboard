import dayjs from 'dayjs';

export type SortOption =
  | 'created:desc'
  | 'created:asc'
  | 'updated:desc'
  | 'priority:asc'
  | 'priority:desc'
  | 'title:asc'
  | 'title:desc';

interface SortOptionItem {
  value: SortOption;
  label: string;
}

export const SORT_OPTIONS: SortOptionItem[] = [
  { value: 'created:desc', label: 'Newest first' },
  { value: 'created:asc', label: 'Oldest first' },
  { value: 'updated:desc', label: 'Recently updated' },
  { value: 'priority:asc', label: 'Priority (high to low)' },
  { value: 'priority:desc', label: 'Priority (low to high)' },
  { value: 'title:asc', label: 'Title (A-Z)' },
  { value: 'title:desc', label: 'Title (Z-A)' },
];

interface Sortable {
  createdAt: string;
  updatedAt: string;
  priority: number;
  title: string;
}

export type SortField = 'priority' | 'created' | 'updated' | 'title';
export type SortDirection = 'asc' | 'desc';
export interface SortKey {
  field: SortField;
  dir: SortDirection;
}

export const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: 'priority', label: 'Priority' },
  { value: 'created', label: 'Created' },
  { value: 'updated', label: 'Updated' },
  { value: 'title', label: 'Title' },
];

// Direction labels are field-specific so "asc/desc" stays meaningful
// (priority 0 = highest, so ascending number = high priority first).
export function directionLabel(field: SortField, dir: SortDirection): string {
  switch (field) {
    case 'priority':
      if (dir === 'asc') return 'High → Low';
      return 'Low → High';
    case 'title':
      if (dir === 'asc') return 'A → Z';
      return 'Z → A';
    case 'created':
    case 'updated':
      if (dir === 'desc') return 'Newest';
      return 'Oldest';
  }
}

function compareByField<T extends Sortable>(a: T, b: T, field: SortField): number {
  switch (field) {
    case 'priority':
      return a.priority - b.priority;
    case 'created':
      return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf();
    case 'updated':
      return dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf();
    case 'title':
      return a.title.localeCompare(b.title);
    default:
      return 0;
  }
}

export function compareByKeys<T extends Sortable>(a: T, b: T, keys: SortKey[]): number {
  for (const key of keys) {
    const result = compareByField(a, b, key.field);
    if (result !== 0) {
      if (key.dir === 'asc') return result;
      return -result;
    }
  }
  return 0;
}
