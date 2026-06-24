import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import type { Article } from '@/shared/models/article';
import { Routes } from '@/core/navigation/routes';

/**
 * Shared navigation command: open an article's detail route. Every list
 * ViewModel (headlines, search, saved) reuses this, so the router wiring and
 * the typed route builder aren't repeated per screen.
 */
export function useOpenArticle() {
  const router = useRouter();
  return useCallback(
    (article: Article) => router.push(Routes.article(article.url)),
    [router],
  );
}
