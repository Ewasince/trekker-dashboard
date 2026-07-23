'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchQuery } from '@/hooks/api-query';

interface TagsResponse {
  tags: string[];
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => fetchQuery<TagsResponse>('/api/tags', {}, 'Failed to fetch tags'),
  });
}
