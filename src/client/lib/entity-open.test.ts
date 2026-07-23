import { describe, expect, test } from 'bun:test';

import { clickIntent } from '@/lib/entity-open';

describe('clickIntent', () => {
  test('plain left click → in-place', () => {
    expect(clickIntent({ button: 0, ctrlKey: false, metaKey: false })).toBe('in-place');
  });

  test('Ctrl + left click → new-tab', () => {
    expect(clickIntent({ button: 0, ctrlKey: true, metaKey: false })).toBe('new-tab');
  });

  test('Cmd (meta) + left click → new-tab', () => {
    expect(clickIntent({ button: 0, ctrlKey: false, metaKey: true })).toBe('new-tab');
  });

  test('middle click → new-tab', () => {
    expect(clickIntent({ button: 1, ctrlKey: false, metaKey: false })).toBe('new-tab');
  });

  test('right click → ignore', () => {
    expect(clickIntent({ button: 2, ctrlKey: false, metaKey: false })).toBe('ignore');
  });
});
