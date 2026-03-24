import { describe, expect, it } from 'vitest'
import { unknownRecordToEnvSource } from './unknown-record-to-env-source'

describe('unknownRecordToEnvSource', () => {
  it('maps primitives and omits functions', () => {
    const out = unknownRecordToEnvSource({
      a: 'x',
      b: 2,
      c: true,
      d: undefined,
      e: () => 1,
      f: { n: 1 },
    })
    expect(out.a).toBe('x')
    expect(out.b).toBe('2')
    expect(out.c).toBe('true')
    expect(out.d).toBeUndefined()
    expect(out.e).toBeUndefined()
    expect(out.f).toBe('{"n":1}')
  })
})
