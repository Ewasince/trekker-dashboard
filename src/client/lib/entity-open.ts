import type { MouseEvent } from 'react';

export type ClickIntent = 'new-tab' | 'in-place' | 'ignore';

export function clickIntent(e: { button: number; ctrlKey: boolean; metaKey: boolean }): ClickIntent {
  if (e.button === 1) {
    return 'new-tab';
  }
  if (e.button === 0) {
    if (e.ctrlKey || e.metaKey) {
      return 'new-tab';
    }
    return 'in-place';
  }
  return 'ignore';
}

function entityHashUrl(id: string): string {
  return `${window.location.pathname}${window.location.search}#${id}`;
}

export function entityOpenHandlers(id: string, openInPlace: () => void) {
  function openNewTab() {
    window.open(entityHashUrl(id), '_blank', 'noopener');
  }

  return {
    onClick(e: MouseEvent) {
      const intent = clickIntent(e);
      if (intent === 'new-tab') {
        openNewTab();
      } else if (intent === 'in-place') {
        openInPlace();
      }
    },
    onAuxClick(e: MouseEvent) {
      if (clickIntent(e) === 'new-tab') {
        e.preventDefault();
        openNewTab();
      }
    },
    onMouseDown(e: MouseEvent) {
      if (e.button === 1) {
        e.preventDefault(); // suppress middle-click autoscroll
      }
    },
  };
}
