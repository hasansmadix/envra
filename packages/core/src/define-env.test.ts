import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { defineEnv } from './define-env'
import { str, int, bool, oneOf, url } from './validators'
import { secret } from './validators/secret'
import { EnvValidationError } from './errors/env-error'
import { getInternalSchema } from './internal-schema'
import { runDoctor } from './doctor'

describe('defineEnv', () => {
  const prev = { ...process.env }

  beforeEach(() => {
    process.env = { ...prev }
  })

  afterEach(() => {
    process.env = prev
  })

  it('parses and exposes values', () => {
    process.env.NODE_ENV = 'test'
    process.env.PORT = '4000'
    const env = defineEnv({
      NODE_ENV: oneOf(['development', 'test', 'production'] as const),
      PORT: int().default(3000),
    })
    expect(env.values.PORT).toBe(4000)
    expect(env.get('NODE_ENV')).toBe('test')
    expect(env.has('PORT')).toBe(true)
    expect(env.ok).toBe(true)
  })

  it('throws EnvValidationError when invalid', () => {
    process.env.NODE_ENV = 'test'
    delete process.env.PORT
    expect(() =>
      defineEnv({
        NODE_ENV: oneOf(['development', 'test', 'production'] as const),
        PORT: int(),
      }),
    ).toThrow(EnvValidationError)
  })

  it('collect mode returns issues', () => {
    process.env.NODE_ENV = 'test'
    delete process.env.PORT
    const env = defineEnv(
      {
        NODE_ENV: oneOf(['development', 'test', 'production'] as const),
        PORT: int(),
      },
      { onValidationError: 'collect' },
    )
    expect(env.ok).toBe(false)
    expect(env.issues?.length).toBeGreaterThan(0)
  })

  it('resolves alias', () => {
    const env = defineEnv(
      {
        NODE_ENV: oneOf(['development', 'test', 'production'] as const),
        DB_URL: str().alias('DATABASE_URL'),
      },
      {
        source: {
          NODE_ENV: 'test',
          DATABASE_URL: 'postgres://x',
        },
      },
    )
    expect(env.values.DB_URL).toBe('postgres://x')
  })

  it('masks secret in issues', () => {
    process.env.NODE_ENV = 'test'
    process.env.DB_URL = 'not-a-url'
    try {
      defineEnv({
        NODE_ENV: oneOf(['development', 'test', 'production'] as const),
        DB_URL: secret(url()),
      })
      expect.fail('should throw')
    } catch (e) {
      expect(e).toBeInstanceOf(EnvValidationError)
      const msg = (e as EnvValidationError).message
      expect(msg).toContain('[REDACTED]')
    }
  })

  it('attaches schema for tooling', () => {
    process.env.NODE_ENV = 'test'
    const env = defineEnv({
      NODE_ENV: oneOf(['development', 'test', 'production'] as const),
    })
    const s = getInternalSchema(env)
    expect(s?.NODE_ENV).toBeDefined()
  })
})

describe('runDoctor', () => {
  it('reports undeclared with suggestion', () => {
    const builders = { DATABASE_URL: str() }
    const schema = Object.fromEntries(
      Object.entries(builders).map(([k, b]) => [k, b.build()]),
    )
    const issues = runDoctor({
      schema,
      env: { DATABSE_URL: 'x' },
      profile: 'development',
    })
    const u = issues.filter((i) => i.code === 'UNDECLARED_ENV')
    expect(u.length).toBe(1)
    expect(u[0]?.suggestion).toMatch(/DATABASE_URL/)
  })
})
