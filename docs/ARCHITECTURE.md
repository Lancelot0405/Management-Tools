# Kiến Trúc Kỹ Thuật — Management Tools

## Stack Overview

| Layer | Technology | Ghi chú |
|-------|-----------|---------|
| UI Framework | React 19 + TypeScript ~6 | Strict mode |
| Build Tool | Vite 8 | Dev server + HMR |
| UI Components | HeroUI v3.2 | Nguồn duy nhất cho UI |
| Styling | Tailwind CSS 4 | Dark mode via class |
| Server State | TanStack Query v5 | Caching + mutations |
| Routing | React Router v7 | Lazy loading |
| Forms | React Hook Form v7 + Zod | Validation |
| Animation | Framer Motion | Page transitions |
| Icons | Lucide React | Không dùng thư viện khác |
| Backend | Supabase | PostgreSQL + Auth + Realtime |
| Export | @react-pdf/renderer + xlsx | PDF + Excel |
| Testing | Vitest 2 + Testing Library + MSW | |
| Deployment | Vercel | CI/CD tự động |

---

## Cấu Trúc Thư Mục

```
Management-Tools/
├── docs/                    # Tài liệu kỹ thuật
│   ├── PLAN.md              # Roadmap & ADR
│   ├── ARCHITECTURE.md      # File này
│   ├── HR-REDESIGN.md       # Design notes HR
│   ├── INVENTORY-REDESIGN.md
│   ├── SCHEDULE-REDESIGN.md
│   └── RESPONSIVE-IOS27-AUDIT.md
├── scripts/                 # Utility scripts (chạy độc lập)
│   └── generate_vapid.js    # Tạo VAPID key pair cho Web Push
├── public/                  # Static assets
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service Worker
│   ├── favicon.svg
│   └── icons/               # PWA icons (192, 512, maskable)
├── src/
│   ├── App.tsx              # Route tree + auth gate
│   ├── main.tsx             # Provider tree
│   ├── index.css            # Design tokens + global styles
│   ├── components/          # Feature-based UI components
│   │   ├── clients/
│   │   ├── dashboard/
│   │   ├── finance/
│   │   ├── hr/
│   │   ├── inventory/
│   │   ├── layout/          # TopBar, BottomNav, Sidebar, Layout
│   │   ├── schedule/
│   │   │   └── tabs/        # EventInfoTab, EventStaffTab, ...
│   │   └── shared/          # Reusable: StatusBadge, DocThumbnail, ...
│   │       └── skeletons/
│   ├── context/             # React Context providers
│   │   ├── AppContext.tsx   # Auth state (useReducer)
│   │   ├── ThemeContext.tsx # Dark/light + accent color
│   │   ├── ToastContext.tsx # Global toast
│   │   ├── FABContext.tsx   # Floating Action Button
│   │   └── appReducer.ts   # Auth reducer
│   ├── hooks/               # Custom React hooks
│   │   ├── queries/         # TanStack Query hooks (fetch)
│   │   │   └── mutations/   # TanStack Query mutations (write)
│   │   ├── useFABRegister.ts
│   │   ├── useInstallPrompt.ts
│   │   ├── useIsDesktop.ts
│   │   ├── useKeyboardOffset.ts
│   │   ├── usePushNotifications.ts
│   │   └── useRealtimeNotifications.ts
│   ├── services/            # Supabase data access layer
│   │   └── api/
│   │       ├── clients.ts   # fetchClients + CRUD mutations
│   │       ├── events.ts    # fetchEvents + CRUD mutations
│   │       ├── inventory.ts # fetchInventory + fetchInventoryLogs + mutations
│   │       ├── registrations.ts # fetchPendingRegistrations
│   │       └── staff.ts     # fetchStaff + CRUD mutations
│   ├── lib/                 # Pure utilities (no side effects)
│   │   ├── supabase.ts      # Supabase client (anon key)
│   │   ├── adminApi.ts      # Edge Function calls (admin-only)
│   │   ├── dateHelpers.ts   # toISODate / fromISODate
│   │   ├── eventStatus.ts   # computeEventStatus
│   │   ├── animations.ts    # Framer motion variants
│   │   ├── errors.ts        # Custom error classes
│   │   ├── queryKeys.ts     # TanStack Query key factory
│   │   ├── validations.ts   # Zod schemas
│   │   ├── utils.ts         # cn() = clsx + tailwind-merge
│   │   └── db.ts            # ⚠️ DEPRECATED — re-export bridge only
│   ├── types/               # TypeScript type definitions
│   │   ├── index.ts         # Domain interfaces
│   │   └── database.types.ts # Auto-generated Supabase types
│   ├── data/                # Static / mock data
│   │   └── mockData.ts      # Mock data cho phát triển/test UI
│   └── test/                # Tất cả test files
│       ├── setup.ts         # Vitest + Testing Library + MSW setup
│       ├── appReducer.test.ts
│       ├── dateHelpers.test.ts
│       ├── eventStatus.test.ts
│       └── validations.test.ts
├── supabase/                # Backend definitions
│   ├── schema.sql           # PostgreSQL schema
│   ├── migrations/          # DB migrations
│   └── functions/admin/     # Edge Functions (admin operations)
└── [config files]
    ├── vite.config.ts
    ├── vitest.config.ts
    ├── tsconfig.*.json
    ├── eslint.config.js
    └── components.json      # HeroUI CLI config
```

---

## Data Flow

```
User Action
    │
    ▼
Component (React)
    │
    ├─── Read  ──► useXxxQuery (TanStack Query) ──► services/api/xxx.ts ──► Supabase DB
    │                    │
    │                    └─── Cache (in-memory, stale-while-revalidate)
    │
    └─── Write ──► useXxxMutation ──► services/api/xxx.ts ──► Supabase DB
                        │
                        └─── invalidateQueries → refetch cache
```

---

## State Management

| State | Giải pháp | Lý do |
|-------|-----------|-------|
| Server data | TanStack Query | Caching, background sync |
| Auth session | AppContext (useReducer) | Shared toàn app, ít thay đổi |
| UI Theme | ThemeContext | Persist qua user_metadata |
| Toast | ToastContext | Global access |
| FAB | FABContext | Per-page registration pattern |
| Form | React Hook Form | Local, không cần global |

---

## Authentication & Authorization

```
Supabase Auth (JWT)
    │
    ├── Role: admin   → Full access (staff, events, finance, HR, clients)
    ├── Role: manager → Events, inventory, finance, HR, clients
    └── Role: staff   → Own profile, own expenses, inventory view
```

- **RLS** bật trên tất cả bảng Supabase
- **Admin operations** đi qua Edge Function (`supabase/functions/admin/`), không expose service key ra frontend
- **ProtectedRoute** wrap các route cần quyền manager/admin

---

## PWA

- **Service Worker** (`public/sw.js`): Network-first cho HTML, Cache-first cho static assets
- **Web Push**: VAPID keys, subscriptions lưu trong bảng `push_subscriptions`
- **iOS Safe Area**: Không dùng `viewport-fit=cover` (iOS 26+ regression fix)

---

## Testing

```
src/test/
├── setup.ts              # Vitest globals, Testing Library, MSW server
├── appReducer.test.ts    # Unit: auth state reducer
├── dateHelpers.test.ts   # Unit: date conversion functions
├── eventStatus.test.ts   # Unit: event status computation
└── validations.test.ts   # Unit: Zod schema validation
```

**Chạy tests:** `npm run test`  
**Watch mode:** `npm run test:watch`

---

## Deployment

- **Platform:** Vercel
- **Branch chiến lược:**
  - `main` / production branch → auto-deploy lên production
  - `test` → preview deployment tại `webapp-fest-manager-git-test-*.vercel.app`
  - `final-gemini` → preview (KHÔNG phải production)
- **Build command:** `npm run build`
- **Output:** `dist/`

> ⚠️ Để đưa lên production: Vercel Dashboard → Deployments → chọn commit → ⋯ → Promote to Production
