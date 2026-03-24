import { describe, it, expect } from 'vitest'
import { defineNextEnv } from './define-next-env'
import { str, url, secret } from '@envra/core'

describe('defineNextEnv', () => {
  it('merges server and client', () => {
    const env = defineNextEnv({
      server: { DB_URL: secret(url()) },
      client: { NEXT_PUBLIC_APP_URL: url() },
      runtimeEnv: {
        NODE_ENV: 'test',
        DB_URL: 'https://db.example',
        NEXT_PUBLIC_APP_URL: 'https://app.example',
      },
      profile: 'test',
    })
    expect(env.values.DB_URL).toBe('https://db.example')
    expect(env.values.NEXT_PUBLIC_APP_URL).toBe('https://app.example')
  })

  it('rejects secret on client', () => {
    expect(() =>
      defineNextEnv({
        server: {},
        client: { NEXT_PUBLIC_X: secret(str()) } as never,
        runtimeEnv: { NODE_ENV: 'test', NEXT_PUBLIC_X: 'a' },
      }),
    ).toThrow(/secret/)
  })

  it('rejects client key without NEXT_PUBLIC_', () => {
    expect(() =>
      defineNextEnv({
        server: {},
        client: { API_URL: url() },
        runtimeEnv: { NODE_ENV: 'test', API_URL: 'https://x.com' },
      }),
    ).toThrow(/NEXT_PUBLIC_/)
  })
})
