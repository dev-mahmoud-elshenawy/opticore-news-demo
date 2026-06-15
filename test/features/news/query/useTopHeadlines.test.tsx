import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTopHeadlines } from '@/features/news/query/useTopHeadlines';
import { newsRepository } from '@/features/news/api/newsRepository';
import type { Article } from '@/shared/models/article';

const article: Article = {
  source: { id: null, name: 'BBC' },
  author: null,
  title: 'Headline',
  description: null,
  url: 'https://example.com/x',
  urlToImage: null,
  publishedAt: '2026-06-14T00:00:00Z',
  content: null,
};

function wrapper({ children }: { children: React.ReactNode }) {
  // Stable across re-renders so cached query state survives a rerender.
  const [client] = React.useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useTopHeadlines', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns articles from the repository for the category', async () => {
    const spy = jest
      .spyOn(newsRepository, 'getTopHeadlines')
      .mockResolvedValue([article]);

    const { result } = renderHook(() => useTopHeadlines('science'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(spy).toHaveBeenCalledWith('science');
    expect(result.current.data).toEqual([article]);
  });
});
