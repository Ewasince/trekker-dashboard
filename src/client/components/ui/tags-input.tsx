'use client';

import { X } from 'lucide-react';
import * as React from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TagsInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
}

function parseTags(value: string): string[] {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function dedupeTags(list: string[]): string[] {
  const seen = new Set<string>();
  return list.filter((t) => {
    const key = t.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function TagsInput({
  value,
  onChange,
  suggestions,
  placeholder = 'bug, frontend, urgent',
  className,
}: TagsInputProps) {
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const tags = React.useMemo(() => dedupeTags(parseTags(value)), [value]);

  const setTags = (next: string[]) => {
    const deduped = dedupeTags(next);
    onChange(deduped.join(', '));
  };

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag.length === 0) return;
    setTags([...tags, tag]);
    setSearch('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const filteredSuggestions = React.useMemo(() => {
    const selected = new Set(tags.map((t) => t.toLowerCase()));
    const searchLower = search.toLowerCase();
    return suggestions.filter(
      (s) => !selected.has(s.toLowerCase()) && s.toLowerCase().includes(searchLower)
    );
  }, [suggestions, tags, search]);

  useOnClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
    setOpen(false);
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (search.trim().length > 0) {
        addTag(search);
      }
      return;
    }

    if ((e.key === ',' || e.key === ' ') && search.trim().length > 0) {
      e.preventDefault();
      addTag(search);
      return;
    }

    const lastTag = tags.at(-1);
    if (e.key === 'Backspace' && search.length === 0 && lastTag) {
      removeTag(lastTag);
    }
  };

  let inputPlaceholder = '';
  if (tags.length === 0) {
    inputPlaceholder = placeholder;
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="flex flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-2 py-1.5 min-h-9">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 text-xs">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="opacity-60 hover:opacity-100"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={inputPlaceholder}
          className="h-6 flex-1 min-w-24 border-0 p-0 shadow-none focus-visible:ring-0"
        />
      </div>

      {open && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="max-h-[200px] overflow-y-auto p-1">
            {filteredSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onClick={() => addTag(s)}
              >
                <span className="truncate">{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
