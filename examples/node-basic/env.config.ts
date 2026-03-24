import { defineEnv, str, int, bool, url, oneOf, secret } from '@envra/core'

export const env = defineEnv({
  NODE_ENV: oneOf(['development', 'test', 'production'] as const).describe(
    'Current runtime environment',
  ),

  APP_URL: url()
    .describe('Public application URL')
    .example('https://example.com'),

  DB_URL: secret(url())
    .serverOnly()
    .describe('Primary database URL'),

  PORT: int().default(3000).describe('HTTP server port'),

  REDIS_ENABLED: bool().default(false),
})
