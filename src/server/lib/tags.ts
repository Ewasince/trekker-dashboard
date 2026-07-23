export function collectDistinctTags(rows: (string | null)[]): string[] {
  const seen = new Set<string>();

  for (const row of rows) {
    if (!row) {
      continue;
    }

    for (const part of row.split(',')) {
      const tag = part.trim();
      if (tag.length > 0) {
        seen.add(tag);
      }
    }
  }

  return [...seen].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
}

// ponytail: LIKE match assumes tags stored comma-separated (", " or ",") and that tag
// values contain no LIKE wildcards (%/_); acceptable for the tag charset used by the app.
export function buildTagFilterClause(tags: string[]): { clause: string; params: string[] } {
  const perTag = tags.map(
    () => "(',' || REPLACE(tags, ', ', ',') || ',') LIKE ('%,' || ? || ',%')"
  );

  return {
    clause: `(${perTag.join(' OR ')})`,
    params: [...tags],
  };
}
