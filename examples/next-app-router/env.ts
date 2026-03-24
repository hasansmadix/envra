import { defineNextEnv, str, url, secret } from '@envra/next'

export const env = defineNextEnv({
  server: {
    DB_URL: secret(url()),
    INTERNAL_API_KEY: secret(str()),
  },
  client: {
    NEXT_PUBLIC_APP_URL: url(),
  },
  runtimeEnv: process.env,
})
