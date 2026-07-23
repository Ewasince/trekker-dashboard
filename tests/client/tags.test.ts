import { describe, expect, it } from 'bun:test';

import { hasAnyTag, parseTagList } from '@/lib/tags';

describe('parseTagList', () => {
  it('splits, trims, and drops empties', () => {
    expect(parseTagList('ui,  backend , ,urgent')).toEqual(['ui', 'backend', 'urgent']);
  });

  it('returns an empty array for an empty string', () => {
    expect(parseTagList('')).toEqual([]);
  });
});

describe('hasAnyTag', () => {
  it('matches ANY selected tag, case-insensitively', () => {
    expect(hasAnyTag('ui, backend', ['UI'])).toBe(true);
    expect(hasAnyTag('backend', ['ui', 'backend'])).toBe(true);
  });

  it('does not match on substrings', () => {
    // "ui" must not match a task tagged "guide"
    expect(hasAnyTag('guide', ['ui'])).toBe(false);
  });

  it('is true when nothing is selected', () => {
    expect(hasAnyTag(null, [])).toBe(true);
  });

  it('is false when the task has no tags but a filter is set', () => {
    expect(hasAnyTag(null, ['ui'])).toBe(false);
  });
});
