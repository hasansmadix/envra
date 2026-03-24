import { FieldBuilder, baseField } from '../field-builder'

export function url(): FieldBuilder<string> {
  return baseField('url', (raw) => {
    const t = raw.trim()
    if (!t) throw new Error('Expected URL')
    try {
      // eslint-disable-next-line no-new
      new URL(t)
      return t
    } catch {
      throw new Error('Invalid URL')
    }
  }) as FieldBuilder<string>
}
