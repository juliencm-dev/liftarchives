
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
