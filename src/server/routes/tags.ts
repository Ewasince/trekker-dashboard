import { DatabaseError } from '@server/errors';
import { getDb, getSqliteInstance } from '@server/lib/db';
import { collectDistinctTags } from '@server/lib/tags';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
  getDb();
  const sqlite = getSqliteInstance();
  if (!sqlite) {
    throw new DatabaseError('Database not initialized');
  }

  const rows = sqlite.query('SELECT tags FROM tasks WHERE tags IS NOT NULL').all() as {
    tags: string | null;
  }[];

  return c.json({ tags: collectDistinctTags(rows.map((r) => r.tags)) });
});

export default app;
