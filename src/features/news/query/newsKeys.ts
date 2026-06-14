import type { NewsCategory } from '../model/news.types';

export const newsKeys = {
  all: ['news'] as const,
  topHeadlines: (category: NewsCategory) =>
    [...newsKeys.all, 'top-headlines', category] as const,
};
