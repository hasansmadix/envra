import { FieldBuilder, baseField } from '../field-builder'

export function json<T = unknown>(): FieldBuilder<T> {
  return baseField('json', (raw) => {
    const t = raw.trim()
    if (!t) throw new Error('Expected JSON')
    try {
      return JSON.parse(t) as T
    } catch {
      throw new Error('Invalid JSON')
    }
  }) as FieldBuilder<T>
}
