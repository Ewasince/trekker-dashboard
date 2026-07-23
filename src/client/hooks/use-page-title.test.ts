import { describe, expect, test } from 'bun:test';

import { pageTitle } from '@/hooks/use-page-title';

describe('pageTitle', () => {
  test('no selection → base title', () => {
    expect(pageTitle(null)).toBe('Trekker');
  });

  test('task selection → base + id', () => {
    expect(pageTitle('TREK-5')).toBe('Trekker: TREK-5');
  });

  test('epic selection → base + id', () => {
    expect(pageTitle('EPIC-2')).toBe('Trekker: EPIC-2');
  });
});
