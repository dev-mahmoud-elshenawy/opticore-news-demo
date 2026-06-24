import { ApiClient, HttpMethod } from 'opticore-react-native';
import { newsRepository } from '@/features/news/api/newsRepository';
import type { Article } from '@/shared/models/article';

describe('newsRepository.getTopHeadlines', () => {
  const sampleArticle: Article = {
    source: { id: null, name: 'TechCrunch' },
    author: 'Jane',
    title: 'Hello',
    description: 'desc',
    url: 'https://example.com/a',
    urlToImage: null,
    publishedAt: '2026-06-14T00:00:00Z',
    content: null,
  };

  let requestSpy: jest.SpyInstance;

  beforeEach(() => {
    // Ensure the singleton is considered initialized so the fail-fast guard in
    // request() never fires before the spy intercepts the call.
    if (!ApiClient.getInstance().isInitialized()) {
      ApiClient.getInstance().configure({ baseURL: 'https://test.example.com' });
    }
    requestSpy = jest
      .spyOn(ApiClient.getInstance(), 'request')
      .mockResolvedValue({
        data: { status: 'ok', totalResults: 1, articles: [sampleArticle] },
        status: 200,
        headers: {},
        config: {},
      } as never);
  });

  afterEach(() => requestSpy.mockRestore());

  it('requests top-headlines for the given category and returns articles', async () => {
    const result = await newsRepository.getTopHeadlines('technology');

    expect(requestSpy).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      url: '/top-headlines',
      params: { country: 'us', category: 'technology' },
    });
    expect(result).toEqual([sampleArticle]);
  });

  it('returns an empty array when articles is absent on an ok response', async () => {
    requestSpy.mockResolvedValue({
      data: { status: 'ok', totalResults: 0 },
      status: 200,
      headers: {},
      config: {},
    } as never);

    await expect(newsRepository.getTopHeadlines('general')).resolves.toEqual([]);
  });
});
