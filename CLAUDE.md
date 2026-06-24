# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm install                      # install dependencies
npm start                        # expo start (press i / a, or scan in Expo Go / dev build)
npm run ios | npm run android    # native run
npm run web                      # expo start --web
npm run lint                     # expo lint
npx tsc --noEmit                 # type-check (strict mode; must stay at 0 errors)

npm test                         # jest (jest-expo preset)
npm run test:watch
npx jest test/features/news/api/newsRepository.test.ts   # single test file
npx jest -t "returns articles"                            # single test by name
```

Requires `EXPO_PUBLIC_NEWS_API_KEY` in `.env` (copy from `.env.example`). newsapi.org's free tier
only authorizes `localhost`/dev origins, so this app is **dev-only**.

## Expo SDK

Targets **Expo SDK 54** (Expo Go compatible). Do not bump the SDK or upgrade native modules without
explicit intent — versions are pinned to stay aligned. Per AGENTS.md, consult the **v54.0.0** Expo
docs before changing native code.

## Architecture

This is a reference app for the locally-linked **`opticore-react-native`** library
(`file:../opticore-react-native`). The defining constraint is a strict **layered, feature-based**
structure — understanding the boundaries matters more than any single file. See
[ORIENTATION.md](./ORIENTATION.md) for a diagram-first map of these layers.

**The dependency chain (each layer only knows the one below it):**

```
route (src/app) → screen (View) → ViewModel hook → React Query hook → repository → newsEndpoints → OptiCore ApiClient → newsapi.org
```

- **`src/app/`** — expo-router routes only. They are thin and delegate to a feature's screen. Layout
  is `(tabs)` (headlines/search/saved) plus a shared `article/[url]` detail route. `_layout.tsx`
  nests providers: `OptiCoreProvider` (transport + error handling) wraps `QueryClientProvider`
  (server cache).
- **`src/features/<feature>/`** — vertical slices with a public surface via `index.ts`. `news` owns
  headlines + search; `saved` is a store-only feature (no API). Each slice keeps its own
  `api/ model/ query/ store/ hooks/ ui/` — where `hooks/` holds the per-screen **ViewModels**
  (`use*Screen`) and `ui/` holds the presentational screens/components.
- **`src/shared/`** — cross-feature building blocks (the `Article` domain model, `ArticleCard`,
  theme, and `hooks/useOpenArticle`). The `Article` model lives here because both `news` and
  `saved` use it.
- **`src/core/`** — app-wide wiring: `opticore.config.ts` (newsapi baseURL + `X-Api-Key`),
  `navigation/` (typed route builders + tab defs), `query/queryClient.ts`.
- **`src/composition/`** — cross-feature composition, above features and below the router.
  `useArticleDetail` lives here: the article-detail route combines `news` (cached article) and
  `saved` (bookmark toggle), and since neither feature may import the other, the composition root
  is its own layer.

**Non-negotiable layering rules** (these are what reviews check for):

- Screens are thin **Views**: each binds exactly one **ViewModel** (`hooks/use*Screen`) and renders.
  The ViewModel owns the data hooks, local state, and navigation commands — the View never calls
  `useQuery`, stores, `useRouter`, or the repository directly. (`renderItem` stays in the View.)
  Pure presentational screens with no data (e.g. `ArticleDetailScreen`) take props and need no ViewModel.
- The **repository** (`newsRepository`) is the only code that knows newsapi's response envelope.
  **`newsEndpoints`** is the only place that defines paths/query params — it returns
  `{ url, params }` descriptors and lets `ApiClient` (axios) serialize the query string, so there's
  no inline string concatenation or `encodeURIComponent` at call sites.
- **Zustand holds client state only**: ephemeral UI state (`newsFilterStore` = selected category)
  or persisted bookmarks (`savedStore`). Server data lives in **React Query**, never in a store.
- **Navigation uses typed builders** from `core/navigation/routes.ts` — no inline path strings. The
  shared `useOpenArticle` hook (`shared/hooks`) wraps `useRouter` once so screens/ViewModels never
  repeat it.
- **Error handling is automatic**: OptiCore's `ApiClient` throws an `ApiError` on any non-2xx
  response (carrying the server message), so repositories only map the successful body to typed
  domain data — they do not branch on status codes.

## OptiCore integration specifics

- All HTTP goes through `ApiClient.getInstance().request(...)` — baseURL, retry, timeout, and the
  `X-Api-Key` header are configured once in `core/opticore.config.ts`.
- `savedStore` persists via OptiCore's `createPersistStorage`; `partialize` writes only `items` (not
  the action functions).
- `metro.config.js` wraps the default config with `withOptiCoreMetroConfig` to force a single React
  instance (the library is a local file dependency, so duplicate React/React Native would otherwise
  occur).

## Conventions

- Path alias `@/*` → `src/*` (configured in both `tsconfig.json` and the jest `moduleNameMapper`).
- Tests live under `test/`, mirroring the `src/` tree.
- TypeScript `strict` is on.
