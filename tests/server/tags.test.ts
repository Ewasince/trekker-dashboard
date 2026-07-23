import { afterEach, describe, expect, it } from 'bun:test';

import { collectDistinctTags } from '@server/lib/tags';

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
