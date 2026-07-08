# 📰 OptiCore News Demo

**The official reference app for [`opticore-react-native`](https://github.com/dev-mahmoud-elshenawy/opticore-react-native)**

A production-shaped Expo app that consumes the OptiCore library **end-to-end through its facades and factories** — never reaching for the underlying singletons (`.getInstance()`) or third-party libraries (`zustand`, `axios`) directly. One clean, layered, feature-based blueprint you can copy.

[![Expo SDK](https://img.shields.io/badge/Expo_SDK-54-000020?logo=expo&logoColor=white)](https://expo.dev) [![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=black)](https://reactnative.dev) [![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![Built with opticore-react-native](https://img.shields.io/badge/built_with-opticore--react--native-7C3AED)](https://github.com/dev-mahmoud-elshenawy/opticore-react-native) [![E2E: Detox](https://img.shields.io/badge/E2E-Detox-262626?logo=testcafe&logoColor=white)](E2E_TESTING.md) [![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

<a href="https://www.buymeacoffee.com/m.elshenawy">
  <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support%20My%20Work-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=0D1117" alt="Buy Me A Coffee"/>
</a>

---

## 🔥 Why this repo?

It's the **canonical example** of how a real app is structured on top of OptiCore:

- **Facades only** — `api` / `storage` / `logger`, never `.getInstance()` or raw `axios`/`zustand`
- **Repository pattern** over the `api` facade for the network layer
- **React Query** for server-state caching (loading / error / refetch out of the box)
- **`createClientStore`** factory for ephemeral *and* persisted client state
- **Feature-based, layered architecture** with strict one-way dependencies
- **Three real feature slices** — News (Headlines + Search), Saved, Settings — on a bottom-tab layout, backed by [newsapi.org](https://newsapi.org)

---

## ✨ Features

- 📰 **Headlines** — top stories by category, with React Query loading / error / refetch states and a two-column tablet layout
- 🔎 **Search** — debounced full-text search over newsapi's `/everything`
- 🔖 **Saved** — bookmark articles, persisted across restarts (store-only, no API)
- ⚙️ **Settings** — a Zod-validated preferences form (country, page size) plus light / dark / system theming
- 📴 **Offline-aware** — a global connectivity banner; API failures surface through OptiCore's `ApiError`

---

## 🧩 What this demonstrates

A map from OptiCore's public API to where the demo exercises it — each row is a real, production-shaped usage of that piece.

| OptiCore                                               | Where in the demo                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------- |
| `OptiCoreProvider` · `OptiCoreErrorBoundary`           | `src/app/_layout.tsx` (wraps the app, configured once)              |
| `CoreConfig` (baseURL · headers · retry · timeout)     | `src/core/opticore.config.ts`                                       |
| `api` facade (verbs return the body, no `getInstance`) | `features/news/api/newsRepository.ts`                               |
| `createQueryClient` + React Query defaults             | `src/core/query/queryClient.ts` + `features/news/query/`            |
| `createClientStore` (client state, optional `persist`) | `saved` · `settings` · `news` stores (no direct `zustand` import)   |
| `useFormState` + Zod                                   | `features/settings/hooks/useSettingsScreen.tsx`                     |
| `useTheme` / `useStyles` · light/dark/system           | `shared/theme/useStyles.ts` + Settings screen                       |
| `useDebounce` · `useConnectivity` · `useResponsive`    | Search VM · global `OfflineBanner` · tablet grid                    |
| `ApiError` (auto-thrown on non-2xx)                    | repositories map only the success body                              |
| `withOptiCoreMetroConfig` (single React instance)      | `metro.config.js`                                                   |

---

## 🚀 Getting Started

```bash
# 1. Install (the library is linked via file:../opticore-react-native)
npm install

# 2. Provide your newsapi.org key (gitignored)
cp .env.example .env        # then edit .env and set EXPO_PUBLIC_NEWS_API_KEY

# 3. Run
npm start                   # then press i / a, or scan in Expo Go / a dev build
```

> ⚠️ newsapi.org's free tier only authorizes requests from `localhost`/development origins, so this demo is **dev-only**.

---

## 🧪 Quality Gates

```bash
npm test                    # jest unit/integration suites
npx tsc --noEmit            # 0 type errors (strict mode)
npm run e2e:test:ios        # Detox end-to-end on a simulator
```

- **Unit/integration** — jest suites under `test/`, mirroring `src/`.
- **End-to-end** — Detox drives the built app through one full user journey. Needs a native build (not Expo Go). 👉 **[E2E_TESTING.md](E2E_TESTING.md)** is the QC guide: setup, running, artifacts, and troubleshooting.

---

## 🏛 Architecture — layered, multi-feature

> 🗺 For a diagram-first map (Mermaid), see **[ORIENTATION.md](./ORIENTATION.md)**.

```
src/
├── app/                         # expo-router routes (thin — delegate to features)
│   ├── _layout.tsx              # <OptiCoreProvider> + React Query provider wrap the app
│   ├── index.tsx                # redirects to /(tabs)/headlines
│   ├── (tabs)/                  # bottom-tab navigator
│   │   ├── _layout.tsx          # Tabs, driven by core/navigation/tabs.ts
│   │   ├── headlines.tsx        # → features/news NewsListScreen
│   │   ├── search.tsx           # → features/news SearchScreen
│   │   ├── saved.tsx            # → features/saved SavedScreen
│   │   └── settings.tsx         # → features/settings SettingsScreen
│   └── article/[url].tsx        # article-detail route → binds composition/useArticleDetail
├── core/
│   ├── opticore.config.ts       # CoreConfig: newsapi baseURL + X-Api-Key header
│   ├── navigation/              # routes.ts (typed route builders) + tabs.ts (tab defs)
│   └── query/queryClient.ts     # shared React Query client
├── shared/                      # cross-feature building blocks
│   ├── models/article.ts        # Article domain model (used by news + saved)
│   ├── components/              # TextField, OfflineBanner (primitives) + article/ (ArticleCard, list helpers)
│   ├── constants/env.ts         # NEWS_API_KEY (single read of EXPO_PUBLIC_NEWS_API_KEY)
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
    │   ├── store/newsFilterStore.ts  # createClientStore — selected category (UI state only)
    │   ├── hooks/                # ViewModels: useNewsListScreen, useSearchScreen
    │   ├── ui/components/        # CategoryFilter, SearchBar
    │   ├── ui/screens/           # NewsListScreen, SearchScreen (Views), ArticleDetailScreen (presentational)
    │   └── index.ts              # the feature's public surface
    ├── saved/                   # bookmarks vertical slice (store-only, no API)
    │   ├── store/savedStore.ts   # createClientStore (persist: true) — bookmarks
    │   ├── hooks/useSavedScreen.tsx  # ViewModel
    │   ├── ui/screens/SavedScreen.tsx
    │   └── index.ts
    └── settings/                # preferences + theme (forms vertical slice)
        ├── model/preferences.ts # domain: Preferences + PAGE_SIZE constraint
        ├── store/preferencesStore.ts  # createClientStore (persist: true) — prefs
        ├── hooks/useSettingsScreen.tsx  # ViewModel — owns the Zod form schema + theme control
        ├── ui/screens/SettingsScreen.tsx  # form via shared TextField + light/dark/system toggle
        └── index.ts

test/                            # jest suites mirror src/ (repository, query, store)
e2e/                             # Detox end-to-end flow (see E2E_TESTING.md)
```

### 🔀 Data flow

```
NewsListScreen (View) ─▶ useNewsListScreen (ViewModel)
        ├─ reads newsFilterStore.category   (CategoryFilter sets it)
        └─▶ useTopHeadlines(category)              [React Query: cache/loading/error/refetch]
                   └─▶ newsRepository.getTopHeadlines(category)   [Repository]
                              └─▶ newsEndpoints.topHeadlines(category)   [{ url, params }]
                                     └─▶ api.get(url, { params })  [facade → body, query serialized]
                                            └─▶ newsapi.org/v2

SearchScreen (View) ─▶ useSearchScreen (ViewModel: term + debounce) ─▶ useSearchNews(query) ─▶ newsRepository.searchEverything(query) ─▶ …
SavedScreen (View)  ─▶ useSavedScreen (ViewModel) ─▶ useSavedStore.items
SettingsScreen (View) ─▶ useSettingsScreen (ViewModel: useFormState + Zod, useTheme().setMode) ─▶ usePreferencesStore
article/[url] route ─▶ useArticleDetail (composition: news cache + saved) ─▶ ArticleDetailScreen
ArticleCard "save"  ──▶ useSavedStore.toggle(article)  [persisted across restarts]
```

### 📐 Layering rules

- Screens are thin **Views** — each binds one **ViewModel** (`hooks/use*Screen`) that owns the data
  hooks, local state, and navigation; the View never calls `useQuery`/stores/`useRouter`/the
  repository directly (`renderItem` stays in the View). Cross-feature screens compose in
  `src/composition/` (e.g. `useArticleDetail`), since features never import each other.
- The **repository** is the only place that knows newsapi's envelope; **`newsEndpoints`** is the
  only place that defines paths/query params (returning `{ url, params }` descriptors that
  `ApiClient` serializes). The repository returns typed `Article[]` and throws on API errors.
- Client state uses OptiCore's **`createClientStore`** factory (no direct `zustand` import):
  ephemeral UI state (`newsFilterStore`'s category) or persisted state (`savedStore`,
  `preferencesStore`, via `persist: true`). Server data lives in **React Query**, never a store.
- Navigation uses **typed route builders** in `core/navigation/routes.ts` — no inline path
  strings at call sites.
- All HTTP goes through the **`api` facade** (verbs return the body; no `.getInstance()`), backed by
  OptiCore's configured client (baseURL, retry, the `X-Api-Key` header set once in
  `core/opticore.config.ts`). App code uses the `api` / `storage` / `logger` facades throughout.

---

## 📝 Notes

- Runs on **Expo SDK 54** (Expo Go compatible).
- Linked to the local library via `"opticore-react-native": "file:../opticore-react-native"` with
  `withOptiCoreMetroConfig` (in `metro.config.js`) to keep a single React instance.
- Saved articles and preferences persist via `createClientStore`'s `persist: true`; `partialize`
  writes only data (e.g. the `items` array), never the action functions.

---

## 📚 Related

| Project | Description |
| ------- | ----------- |
| ⚡ **[opticore-react-native](https://github.com/dev-mahmoud-elshenawy/opticore-react-native)** | The infrastructure library this app is built on ([npm](https://www.npmjs.com/package/opticore-react-native)) |
| 🧪 **[E2E_TESTING.md](E2E_TESTING.md)** | QC guide for the Detox end-to-end suite |
| 🗺 **[ORIENTATION.md](ORIENTATION.md)** | Diagram-first architecture map |

---

## 👤 Created By

<div align="center">

### Built with ❤️ by [Mahmoud El Shenawy](https://github.com/dev-mahmoud-elshenawy)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?logo=linkedin&logoColor=white&style=for-the-badge)](https://www.linkedin.com/in/dev-mahmoud-elshenawy) [![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=for-the-badge)](https://github.com/dev-mahmoud-elshenawy) [![Medium](https://img.shields.io/badge/Medium-000000?logo=medium&logoColor=white&style=for-the-badge)](https://medium.com/@dev-mahmoud-elshenawy) [![Facebook](https://img.shields.io/badge/Facebook-1877F2?logo=facebook&logoColor=white&style=for-the-badge)](https://www.facebook.com/dev.m.elshenawy)

</div>

---

## 📜 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

Released under the **[MIT License](LICENSE)** — free to use, modify, and distribute.
