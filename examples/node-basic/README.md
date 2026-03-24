# envra — Node (basic)

1. From this directory, set variables (or use a `.env` loader before importing):

```bash
set NODE_ENV=development
set APP_URL=https://example.com
set DB_URL=https://db.example
```

2. Validate:

```bash
pnpm env:check
pnpm env:doctor
pnpm env:sync
pnpm env:docs
```

The CLI loads `env.config.ts` via `jiti` and reads the schema from the exported `env` object (internal schema attachment).
