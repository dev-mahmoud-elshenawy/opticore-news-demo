import { ApiClient, HttpMethod } from 'opticore-react-native';
import { newsRepository } from './newsRepository';
import type { Article } from '../model/news.types';

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
      url: '/top-headlines?country=us&category=technology',
    });
    expect(result).toEqual([sampleArticle]);
  });

  it('throws when newsapi returns status "error"', async () => {
    requestSpy.mockResolvedValue({
      data: { status: 'error', code: 'apiKeyInvalid', message: 'bad key' },
      status: 200,
      headers: {},
      config: {},
    } as never);

    await expect(newsRepository.getTopHeadlines('business')).rejects.toThrow('bad key');
  });
});
