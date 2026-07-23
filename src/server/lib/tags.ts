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

  return Array.from(seen).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
}
