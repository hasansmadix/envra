import { defineEnv, str, unknownRecordToEnvSource, oneOf } from '@envra/core'

/** Field builders only — use in ConfigModule.validate after merging env files */
export const envraSchema = {
  NODE_ENV: oneOf(['development', 'test', 'production'] as const),
  DATABASE_URL: str(),
}

/**
 * Nest `ConfigModule.forRoot({ validate })` receives a plain object.
 * Use `unknownRecordToEnvSource` so numbers/objects are not coerced to `[object Object]`.
 */
export function validateNestConfig(config: Record<string, unknown>) {
  const source = unknownRecordToEnvSource(config)
  return defineEnv(envraSchema, {
    source,
    profile: source.NODE_ENV ?? 'development',
  }).values
}
