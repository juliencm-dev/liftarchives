
# AGENT.md

# Repository Pattern

Any time you will need to write database query, make sure to write it in one of the repositories. This way we always have a single source of truth for data access. No direct query should be made in any other services without passing through the repository. This also allows us to easily swap out the underlying database technology if needed, without affecting the rest of the application.

# Shell Usage

**`cd` is broken in this environment.** The user has zoxide aliased to `cd`, which causes:
```
z:1: command not found: __zoxide_z
```

**Rules:**
- NEVER use `cd /path && command`. It will fail every time.
- Use `pushd /path && command; popd` when the tool requires a specific cwd (e.g. `drizzle-kit push`).
- Prefer running commands with full/absolute paths from the project root instead of changing directories (e.g. `bun tsc --project /full/path/tsconfig.json`).

# Client Query & Route Loader Pattern

Every protected page must pre-load its data in the TanStack Router `loader` using `ensureQueryData`. This fires requests **before** the component renders, eliminating waterfalls and loading flickers.

## Rules

1. **All `queryOptions` must be defined in `client/src/lib/queries/`** — one file per domain (sessions.ts, programs.ts, lifts.ts, profile.ts, auth.ts), re-exported from `index.ts`. Never define queryKey/queryFn inline in hooks.

2. **Hooks in `client/src/hooks/` must consume the centralized queryOptions** — e.g. `useQuery(lifterProfileQueryOptions)` not a manual `{ queryKey, queryFn }`. This ensures the route loader and the hook share the same cache entry.

3. **Every route that renders data must have a `loader`** — call `context.queryClient.ensureQueryData(...)` for each query the page needs. Fire them all in parallel (don't `await` — `ensureQueryData` returns a promise but the loader doesn't need to wait for it; TanStack Router handles the concurrent loading).

4. **Set `staleTime` per query category on the queryOptions, not globally** — profile/settings data changes rarely (5min), active session state needs freshness (30s), everything else uses the 2min default.

### Example: adding a new page

```ts
// 1. Create queryOptions in lib/queries/foo.ts
export const fooQueryOptions = queryOptions({
    queryKey: ['foo'] as const,
    staleTime: 5 * 60_000, // tune per data category
    queryFn: async () => { ... },
});

// 2. Export from lib/queries/index.ts
export { fooQueryOptions } from './foo';

// 3. Create hook in hooks/use-foo.ts
export function useFoo() {
    return useQuery(fooQueryOptions);
}

// 4. Add loader in router.tsx
const fooRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/foo',
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(fooQueryOptions);
    },
    component: () => <FooPage />,
});
```

# Cloudflare Workers Deployment

The server runs on Cloudflare Workers with **Cloudflare D1** (SQLite) for the database. Key constraints:

- **D1 (SQLite) database** — No PostgreSQL. All schemas use `drizzle-orm/sqlite-core` (`sqliteTable`, `integer` for timestamps/booleans, `real` for floats, `text` for enums/dates). The D1 binding is passed via `setD1()` in server middleware.
- **No module-level env access** — `process.env` is not populated until the first request. All clients that read env (db, auth, Resend, R2) use the lazy Proxy pattern.
- **Env bridging** — CF bindings (including D1) are bridged to `process.env` via middleware in `server/src/index.ts`.
- **No native binaries** — use WASM alternatives (e.g. `hash-wasm` for argon2, not `@node-rs/argon2`).
- **No filesystem** — no `fs`, `path`, or file-based logging. Use `console.*` (captured by Workers Logs).
- **`setInterval` may not work** — wrap in try/catch. Rate limiter handles this gracefully.
- **Migrations** — Use `wrangler d1 migrations apply liftarchives [--local]` from the `server/` directory. Migration files live in `database/migrations/`.
- **Seeding** — Run `bun run database/src/seed-lifts.ts` to generate `database/seed-lifts.sql`, then apply with `wrangler d1 execute liftarchives --file=database/seed-lifts.sql [--local]`.
