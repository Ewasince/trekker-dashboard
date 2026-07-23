import { buildTagFilterClause, collectDistinctTags } from '@server/lib/tags';
import { afterEach, describe, expect, it } from 'bun:test';

import { cleanupApiTestContexts, createApiTestContext } from './api-test-helpers';

describe('collectDistinctTags', () => {
  it('splits, trims, dedupes across rows and sorts case-insensitively', () => {
    const rows = ['bug, frontend', 'Frontend,urgent', null, '  bug  ', ''];
    expect(collectDistinctTags(rows)).toEqual(['bug', 'frontend', 'Frontend', 'urgent']);
  });

  it('returns an empty array when there are no tags', () => {
    expect(collectDistinctTags([null, '', '  '])).toEqual([]);
  });
});

const cleanupDirs: string[] = [];

afterEach(() => {
  cleanupApiTestContexts(cleanupDirs);
});

describe('GET /api/tags', () => {
  it('returns distinct sorted tags across tasks', async () => {
    const context = createApiTestContext(cleanupDirs);
    await context.createTask({ title: 'A', tags: 'bug, frontend' });
    await context.createTask({ title: 'B', tags: 'urgent,bug' });

    const response = await context.requestJson<{ tags: string[] }>('/api/tags');
    expect(response.status).toBe(200);
    expect(response.body.tags).toEqual(['bug', 'frontend', 'urgent']);
  });
});

describe('buildTagFilterClause', () => {
  it('builds one OR-combined LIKE condition per tag with bound params', () => {
    const { clause, params } = buildTagFilterClause(['ui', 'backend']);
    expect(params).toEqual(['ui', 'backend']);
    expect(clause).toBe(
      "((',' || REPLACE(tags, ', ', ',') || ',') LIKE ('%,' || ? || ',%') OR " +
        "(',' || REPLACE(tags, ', ', ',') || ',') LIKE ('%,' || ? || ',%'))"
    );
  });

  it('builds a single-condition clause for one tag', () => {
    const { clause, params } = buildTagFilterClause(['ui']);
    expect(params).toEqual(['ui']);
    expect(clause).toBe("((',' || REPLACE(tags, ', ', ',') || ',') LIKE ('%,' || ? || ',%'))");
  });
});
