# OptiCore News Demo

A reference Expo app showing a **feature-based architecture** on top of
[`opticore-react-native`](../opticore-react-native): the **repository pattern** for the API
layer, **React Query** for server-state caching, and **Zustand** for ephemeral feature/UI
state. The sample feature is a News list backed by [newsapi.org](https://newsapi.org).

## Getting started

```bash
# 1. Install (the library is linked via file:../opticore-react-native)
npm install --legacy-peer-deps

# 2. Provide your newsapi.org key (gitignored)
cp .env.example .env        # then edit .env and set EXPO_PUBLIC_NEWS_API_KEY

# 3. Run
npm start                   # then press i / a, or scan in a dev build

# Quality gates
npm test                    # jest (3 suites, 7 tests)
npx tsc --noEmit            # 0 type errors
```

> newsapi.org's free tier only authorizes requests from `localhost`/development origins, so this
> demo is dev-only.

## Architecture — one feature, layered

```
src/
├── app/                         # expo-router routes (thin — delegate to the feature)
│   ├── _layout.tsx              # <OptiCoreProvider config={opticoreConfig}> wraps the app
│   ├── index.tsx                # redirects to /(news)
│   └── (news)/
│       ├── index.tsx            # renders features/news → NewsListScreen
│       └── [id].tsx             # article detail (opens the URL in a browser)
├── core/
│   └── opticore.config.ts       # CoreConfig: newsapi baseURL + X-Api-Key header
└── features/news/               # the vertical slice
    ├── api/newsRepository.ts     # repository — the ONLY code that knows newsapi
    ├── model/news.types.ts       # Article, NewsCategory, TopHeadlinesResponse
    ├── query/                    # useTopHeadlines (React Query) + newsKeys factory
    ├── store/newsFilterStore.ts  # Zustand — selected category (UI state only)
    ├── ui/                       # NewsListScreen, CategoryFilter, ArticleCard
    └── index.ts                  # the feature's public surface
```

### Data flow

```
CategoryFilter ──set──▶ Zustand store (category)
                              │
NewsListScreen reads category ┘
        └─▶ useTopHeadlines(category)              [React Query: cache/loading/error/refetch]
                   └─▶ newsRepository.getTopHeadlines(category)   [Repository]
                              └─▶ OptiCore ApiClient.request({ GET, /top-headlines?... })
                                     └─▶ newsapi.org/v2
```

**Layering rules**
- Routes and UI consume the **hook** and **store** — never the repository directly.
- The **repository** is the only place that knows newsapi's URL shape and envelope; it returns
  typed `Article[]` and throws on API errors.
- **Zustand** holds only ephemeral UI state (the selected category). Server data lives in **React
  Query**, never the store.
- All HTTP goes through **OptiCore's `ApiClient`** (baseURL, retry, the `X-Api-Key` header set
  once in `core/opticore.config.ts`).

## Notes

- Linked to the local library via `"opticore-react-native": "file:../opticore-react-native"` with
  `withOptiCoreMetroConfig` (in `metro.config.js`) to keep a single React instance.
- This app runs on Expo SDK 56; the library targets SDK 54 but uses open `>=` peer ranges. The
  Metro bundle builds cleanly; confirm runtime behavior on a device/simulator.
- Install uses `--legacy-peer-deps` (mixed peer ranges across the SDK 56 toolchain).
