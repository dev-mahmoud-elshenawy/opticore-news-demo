# OptiCore News Demo

A reference Expo app showing a **feature-based architecture** on top of
[`opticore-react-native`](../opticore-react-native): the **repository pattern** for the API
layer, **React Query** for server-state caching, and **Zustand** for ephemeral/persisted client
state. It ships three features — **Headlines**, **Search**, and **Saved** — across a bottom-tab
layout, backed by [newsapi.org](https://newsapi.org).

## Getting started

```bash
# 1. Install (the library is linked via file:../opticore-react-native)
npm install

# 2. Provide your newsapi.org key (gitignored)
cp .env.example .env        # then edit .env and set EXPO_PUBLIC_NEWS_API_KEY

# 3. Run
npm start                   # then press i / a, or scan in Expo Go / a dev build

# Quality gates
npm test                    # jest (3 suites)
npx tsc --noEmit            # 0 type errors
```

> newsapi.org's free tier only authorizes requests from `localhost`/development origins, so this
> demo is dev-only.

## Architecture — layered, multi-feature

> For a diagram-first map (Mermaid), see [ORIENTATION.md](./ORIENTATION.md).

```
src/
├── app/                         # expo-router routes (thin — delegate to features)
│   ├── _layout.tsx              # <OptiCoreProvider> + React Query provider wrap the app
│   ├── index.tsx                # redirects to /(tabs)/headlines
│   ├── (tabs)/                  # bottom-tab navigator
│   │   ├── _layout.tsx          # Tabs, driven by core/navigation/tabs.ts
│   │   ├── headlines.tsx        # → features/news NewsListScreen
│   │   ├── search.tsx           # → features/news SearchScreen
│   │   └── saved.tsx            # → features/saved SavedScreen
│   └── article/[url].tsx        # article-detail route → binds composition/useArticleDetail
├── core/
│   ├── opticore.config.ts       # CoreConfig: newsapi baseURL + X-Api-Key header
│   ├── navigation/              # routes.ts (typed route builders) + tabs.ts (tab defs)
│   └── query/queryClient.ts     # shared React Query client
├── shared/                      # cross-feature building blocks
│   ├── models/article.ts        # Article domain model (used by news + saved)
│   ├── components/              # ArticleCard, article list helpers
│   ├── hooks/useOpenArticle.ts  # shared nav command (wraps useRouter once)
│   └── theme/useStyles.ts       # styling hook
├── composition/                # cross-feature composition (above features, below routes)
│   └── useArticleDetail.ts      # article-detail VM: news (cached article) + saved (bookmark)
└── features/
    ├── news/                    # headlines + search vertical slice
    │   ├── api/
    │   │   ├── newsEndpoints.ts  # single source of paths/params ({ url, params } descriptors)
    │   │   └── newsRepository.ts # repository — the ONLY code that knows newsapi
    │   ├── model/news.types.ts   # NewsCategory, TopHeadlinesResponse, …
    │   ├── query/                # useTopHeadlines, useSearchNews, useArticleByUrl + newsKeys
    │   ├── store/newsFilterStore.ts  # Zustand — selected category (UI state only)
    │   ├── hooks/                # ViewModels: useNewsListScreen, useSearchScreen
    │   ├── ui/components/        # CategoryFilter, SearchBar
    │   ├── ui/screens/           # NewsListScreen, SearchScreen (Views), ArticleDetailScreen (presentational)
    │   └── index.ts              # the feature's public surface
    └── saved/                   # bookmarks vertical slice (store-only, no API)
        ├── store/savedStore.ts   # persisted Zustand store (createPersistStorage)
        ├── hooks/useSavedScreen.tsx  # ViewModel
        ├── ui/screens/SavedScreen.tsx
        └── index.ts

test/                            # jest suites mirror src/ (repository, query, store)
```

### Data flow

```
NewsListScreen (View) ─▶ useNewsListScreen (ViewModel)
        ├─ reads newsFilterStore.category   (CategoryFilter sets it)
        └─▶ useTopHeadlines(category)              [React Query: cache/loading/error/refetch]
                   └─▶ newsRepository.getTopHeadlines(category)   [Repository]
                              └─▶ newsEndpoints.topHeadlines(category)   [{ url, params }]
                                     └─▶ OptiCore ApiClient.request({ GET, … })
                                            └─▶ newsapi.org/v2

SearchScreen (View) ─▶ useSearchScreen (ViewModel: term + debounce) ─▶ useSearchNews(query) ─▶ newsRepository.search(query) ─▶ …
SavedScreen (View)  ─▶ useSavedScreen (ViewModel) ─▶ useSavedStore.items
article/[url] route ─▶ useArticleDetail (composition: news cache + saved) ─▶ ArticleDetailScreen
ArticleCard "save"  ──▶ useSavedStore.toggle(article)  [persisted across restarts]
```

**Layering rules**
- Screens are thin **Views** — each binds one **ViewModel** (`hooks/use*Screen`) that owns the data
  hooks, local state, and navigation; the View never calls `useQuery`/stores/`useRouter`/the
  repository directly (`renderItem` stays in the View). Cross-feature screens compose in
  `src/composition/` (e.g. `useArticleDetail`), since features never import each other.
- The **repository** is the only place that knows newsapi's envelope; **`newsEndpoints`** is the
  only place that defines paths/query params (returning `{ url, params }` descriptors that
  `ApiClient` serializes). The repository returns typed `Article[]` and throws on API errors.
- **Zustand** holds only client state: ephemeral UI state (`newsFilterStore`'s category) or
  persisted bookmarks (`savedStore`). Server data lives in **React Query**, never the store.
- Navigation uses **typed route builders** in `core/navigation/routes.ts` — no inline path
  strings at call sites.
- All HTTP goes through **OptiCore's `ApiClient`** (baseURL, retry, the `X-Api-Key` header set
  once in `core/opticore.config.ts`).

## Notes

- Runs on **Expo SDK 54** (Expo Go compatible).
- Linked to the local library via `"opticore-react-native": "file:../opticore-react-native"` with
  `withOptiCoreMetroConfig` (in `metro.config.js`) to keep a single React instance.
- Saved articles persist via OptiCore's `createPersistStorage`; only the `items` array is written.
