import { describe, expect, it } from 'vitest'
import { int, str } from './validators'
import { runDoctor } from './doctor'

describe('runDoctor undeclaredPolicy', () => {
  const schema = {
    FOO: str().build(),
    BAR: int().build(),
  }

  it('ignore-system skips PATH-like keys', () => {
    const issues = runDoctor({
      schema,
      env: { FOO: 'a', BAR: '1', PATH: '/usr/bin', USERPROFILE: 'C:\\Users\\x' },
      profile: 'development',
      undeclaredPolicy: 'ignore-system',
    })
    expect(issues.filter((i) => i.code === 'UNDECLARED_ENV')).toHaveLength(0)
  })

  it('all reports undeclared non-schema keys including PATH', () => {
    const issues = runDoctor({
      schema,
      env: { FOO: 'a', BAR: '1', PATH: '/x' },
      profile: 'development',
      undeclaredPolicy: 'all',
    })
    const u = issues.filter((i) => i.code === 'UNDECLARED_ENV')
    expect(u.some((i) => i.key === 'PATH')).toBe(true)
  })

  it('loaded-only only scans keys from loaded set', () => {
    const issues = runDoctor({
      schema,
      env: { FOO: 'a', BAR: '1', PATH: '/x', EXTRA: 'y' },
      profile: 'development',
      undeclaredPolicy: 'loaded-only',
      loadedEnvKeys: new Set(['EXTRA']),
    })
    const u = issues.filter((i) => i.code === 'UNDECLARED_ENV')
    expect(u.map((i) => i.key)).toEqual(['EXTRA'])
  })
})
