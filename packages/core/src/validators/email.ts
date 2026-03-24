import { FieldBuilder, baseField } from '../field-builder'

const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function email(): FieldBuilder<string> {
  return baseField('email', (raw) => {
    const t = raw.trim()
    if (!t) throw new Error('Expected email')
    if (!basic.test(t)) throw new Error('Invalid email format')
    return t
  }) as FieldBuilder<string>
}
