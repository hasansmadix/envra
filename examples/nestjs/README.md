# envra — NestJS

Use `envraSchema` (builders) in documentation and CLI:

```bash
pnpm envra check -c ./env.config.ts
```

Wire validation in `ConfigModule`:

```ts
ConfigModule.forRoot({
  validate: (config) => validateNestConfig(config),
})
```

`validateNestConfig` returns the parsed `values` object suitable for Nest config typing (extend with an interface as needed).
