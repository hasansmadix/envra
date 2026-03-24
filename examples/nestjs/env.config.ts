import { defineEnv, str, oneOf } from '@envra/core'

/** Field builders only — use in ConfigModule.validate after merging env files */
export const envraSchema = {
  NODE_ENV: oneOf(['development', 'test', 'production'] as const),
  DATABASE_URL: str(),
}

/**
 * Nest `ConfigModule.forRoot({ validate })` receives a plain object.
 * Pass it as `source` to defineEnv:
 */
export function validateNestConfig(config: Record<string, unknown>) {
  const flat: Record<string, string | undefined> = {}
  for (const [k, v] of Object.entries(config))
    flat[k] = v === undefined || v === null ? undefined : String(v)

  return defineEnv(envraSchema, {
    source: flat,
    profile: flat.NODE_ENV ?? 'development',
  }).values
}
