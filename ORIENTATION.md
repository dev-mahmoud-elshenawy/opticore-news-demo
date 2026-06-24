# Architecture Orientation — `opticore-news-demo`

Diagram-first map of the app. (Mermaid renders in GitHub / VS Code with a Mermaid extension.)

---

## 1. The layered dependency chain

```mermaid
flowchart TD
    R["Route<br/>src/app/*"] --> S["Screen (View)"]
    S --> VM["ViewModel hook<br/>features/&lt;f&gt;/hooks"]
    VM --> H["React Query hook"]
    VM -.client state.-> Z["Zustand store"]
    VM -.nav command.-> Nav["useOpenArticle"]
    H --> Repo["Repository"]
    Repo --> E["newsEndpoints<br/>({ url, params })"]
    E --> AC["OptiCore ApiClient<br/>(serializes query)"]
    AC --> API["newsapi.org"]

    classDef api fill:#fde,stroke:#c39
    classDef store fill:#def,stroke:#39c
    class API api
    class Z store
```

**Golden rules:** a screen is a thin **View** that binds one **ViewModel** and never calls a query
hook / store / `useRouter` / repository directly · the repository is the only file that knows
newsapi's response shape · `newsEndpoints` is the only file that defines paths/query params.

---

## 2. Five layers, one direction

```mermaid
flowchart LR
    app["src/app<br/>routes"] --> comp["src/composition<br/>cross-feature VMs"]
    comp --> features["src/features<br/>news · saved"]
    app --> features
    features --> shared["src/shared<br/>Article · ArticleCard · theme · useOpenArticle"]
    features --> core["src/core<br/>config · nav · queryClient"]
    app --> core
```

Imports flow **app → composition → features → shared/core**. Shared & core never import features;
features never import each other — cross-feature wiring lives in `src/composition`.

---

## 3. Boot sequence

```mermaid
flowchart TD
    L["_layout.tsx"] --> OP["OptiCoreProvider<br/>(transport + errors)"]
    OP --> QP["QueryClientProvider<br/>(server cache)"]
    QP --> ST["Stack → (tabs)"]
    cfg["core/opticore.config.ts<br/>baseURL · X-Api-Key · timeout"] -.feeds.-> OP
    qc["core/query/queryClient.ts<br/>retry · staleTime"] -.feeds.-> QP
    idx["index.tsx"] -.Redirect.-> head["(tabs)/headlines"]
    tabs["core/navigation/tabs.ts<br/>TABS table"] -.drives.-> tl["(tabs)/_layout.tsx"]
```

Provider order matters: **OptiCore wraps React Query** (retry logic depends on `ApiError`).

---

## 4A. Headlines — the canonical read path

```mermaid
sequenceDiagram
    participant Rt as headlines.tsx
    participant Sc as NewsListScreen (View)
    participant VM as useNewsListScreen (VM)
    participant Z as newsFilterStore
    participant H as useTopHeadlines
    participant Repo as newsRepository
    participant E as newsEndpoints
    participant AC as ApiClient
    Rt->>Sc: render
    Sc->>VM: useNewsListScreen()
    VM->>Z: read category
    VM->>H: useTopHeadlines(category)
    H->>Repo: getTopHeadlines(category)
    Repo->>E: topHeadlines(category)
    E-->>Repo: { url, params }
    Repo->>AC: request({ GET, url, params })
    AC-->>Repo: body → Article[]
    Repo-->>VM: Article[]
    Note over Sc: VM exposes renderItem → openArticle(url)
```

The View only destructures the VM and renders; `renderItem` stays in the View.

---

## 4B. Search — read path + debounced local input

```mermaid
flowchart LR
    SB["SearchBar"] --> VM["useSearchScreen (VM)<br/>term + useDebounce 400ms"]
    VM --> H["useSearchNews<br/>(disabled if empty)"]
    H --> Repo["searchEverything"]
    Repo --> E["everything(q) → { url, params }"]
    E --> API["/everything?q=..."]
```

Search term + debounce live in the **ViewModel** (local state, not a store). No request until the
box is non-empty.

---

## 4C. Article detail — cross-feature composition

```mermaid
flowchart TD
    Route["app/article/[url].tsx"] --> VM["useArticleDetail<br/>src/composition"]
    VM --> A["useArticleByUrl(url)<br/>news feature"]
    VM --> B["useSavedStore<br/>saved feature"]
    A -.scans React Query cache.-> cache["cached news lists"]
    A -. cold start fallback .-> B
    Route --> D["ArticleDetailScreen<br/>(presentational, props only)"]
```

No get-by-id on newsapi → reuse cached list data. Composition lives in `src/composition`
(above features, below the route) because `news` and `saved` never import each other; the screen
imports neither store.

---

## 4D. Saved — store-only feature (no API)

```mermaid
flowchart LR
    Sc["SavedScreen (View)"] --> VM["useSavedScreen (VM)"]
    VM --> Z["useSavedStore<br/>items / toggle / isSaved"]
    Z --> P["persist + createPersistStorage"]
    P --> Disk["device storage<br/>(only items written)"]
```

---

## 5. Two state systems — never mix

```mermaid
flowchart TB
    subgraph RQ["React Query · SERVER data"]
        rq1["headlines"]
        rq2["search results"]
    end
    subgraph ZU["Zustand · CLIENT state"]
        z1["newsFilterStore<br/>(category)"]
        z2["savedStore<br/>(bookmarks, persisted)"]
    end
    VM["a ViewModel"] --> RQ
    VM --> ZU
```

Fetched data → React Query. UI/local/persisted client state → Zustand. Never the reverse.

---

## 6. Feature internals & public surface

```mermaid
flowchart TD
    subgraph news["features/news"]
        ui["ui/ (Views)"] --> hooks["hooks/ (ViewModels)"]
        hooks --> q["query/"]
        hooks -.-> store["store/"]
        q --> api["api/ (repository + endpoints)"]
        model["model/"]
    end
    idx["index.ts<br/>EXPORTS: screens, query hooks, store, types"]
    ui --> idx
    q --> idx
    store --> idx
    internal["NOT exported (internal):<br/>repository · ViewModels"]
    api -.-> internal
    hooks -.-> internal
```

Consumers import from the feature root `index.ts` — never deep paths, never the repository or VMs.

---

## 7. OptiCore touch points

```mermaid
flowchart LR
    OC["opticore-react-native"]
    OC --> t1["ApiClient.request({ url, params }) · transport + query serialization"]
    OC --> t3["ApiError + toMessage · auto errors"]
    OC --> t4["createQueryClient · retry defaults"]
    OC --> t5["createPersistStorage · saved store"]
    OC --> t6["useTheme → useStyles · tokens"]
    OC --> t7["useDebounce · search"]
    OC --> t8["withOptiCoreMetroConfig · single React"]
```

`buildUrl` is still exported by the library, but the app passes `params` to `request()` and lets
the client serialize the query string, so call sites never build URLs by hand.

---

## 8. "Where do I put…?"

```mermaid
flowchart TD
    Q{What am I adding?}
    Q -->|new screen| A1["features/&lt;f&gt;/ui/screens/ (View) → export in index.ts → route in src/app"]
    Q -->|screen data/state/nav| A2["features/&lt;f&gt;/hooks/ (ViewModel)"]
    Q -->|cross-feature screen| A3["src/composition/ (e.g. useArticleDetail)"]
    Q -->|new data fetch| A4["query/ hook + repository method + newsKeys + newsEndpoints"]
    Q -->|new API path/params| A5["newsEndpoints.ts only ({ url, params })"]
    Q -->|new tab| A6["core/navigation/tabs.ts + src/app/(tabs)/"]
    Q -->|client/UI state| A7["features/&lt;f&gt;/store/ (Zustand)"]
    Q -->|used by 2+ features| A8["src/shared/"]
    Q -->|app-wide wiring| A9["src/core/"]
```

---

## 9. Tests mirror `src/`

```
test/features/news/api/newsRepository.test.ts      → body → Article[] mapping
test/features/news/query/useTopHeadlines.test.tsx  → hook wiring
test/features/news/store/newsFilterStore.test.ts   → store transitions
```

---

## 10. Commands

```bash
npm install                      # install (no flag needed)
npm start                        # expo start  ·  npm run ios | android | web
npm run lint                     # expo lint
npx tsc --noEmit                 # type-check (strict, keep at 0)
npm test                         # jest
```

Needs `EXPO_PUBLIC_NEWS_API_KEY` in `.env`. Targets **Expo SDK 54** (dev-only; newsapi free
tier authorizes localhost only). Don't bump SDK/native modules without intent.

---

### First-session reading order

`_layout.tsx` → `headlines.tsx` → `NewsListScreen` (View) → `useNewsListScreen` (ViewModel) →
`useTopHeadlines` → `newsRepository` → `newsEndpoints` → `composition/useArticleDetail` →
`article/[url].tsx` → `savedStore.ts`. That covers every pattern.
