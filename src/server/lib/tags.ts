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

  return [...seen].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

// ponytail: LIKE match assumes tags stored comma-separated (", " or ",") and that tag
// values contain no LIKE wildcards (%/_); acceptable for the tag charset used by the app.
// SQLite LIKE folds case for ASCII only, so non-ASCII tags (e.g. Cyrillic) match
// case-sensitively here while the Kanban path's hasAnyTag folds Unicode via toLowerCase()
// — upgrade path: normalize a lowercased tag column if non-ASCII case-folding matters.
export function buildTagFilterClause(tags: string[]): { clause: string; params: string[] } {
  const perTag = tags.map(
    () => "(',' || REPLACE(tags, ', ', ',') || ',') LIKE ('%,' || ? || ',%')"
  );

  return {
    clause: `(${perTag.join(' OR ')})`,
    params: [...tags],
  };
}
