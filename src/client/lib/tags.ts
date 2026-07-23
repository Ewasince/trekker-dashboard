export function parseTagList(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

export function hasAnyTag(taskTags: string | null, selected: string[]): boolean {
  if (selected.length === 0) {
    return true;
  }

  const taskTagSet = new Set(parseTagList(taskTags ?? '').map((tag) => tag.toLowerCase()));
  return selected.some((tag) => taskTagSet.has(tag.toLowerCase()));
}
